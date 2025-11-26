require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenAI, Type } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// --- DATABASE CONNECTION ---
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let db;
async function connectToDatabase() {
  try {
    db = await mysql.createPool(dbConfig);
    console.log('Conectado a la base de datos MySQL.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

// --- AI APIs SETUP ---
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set for Gemini");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// DM 1: Fast (Standard)
const DM_1_MODEL = 'gemini-2.5-flash';
// DM 2: Reasoning (Thinking enabled)
const DM_2_MODEL = 'gemini-2.5-flash';


// --- HELPER FUNCTION FOR AI RESPONSE ---
const getAIResponse = async (modelName, systemPrompt, genericHistory, prompt, thinkingBudget = 0) => {
    try {
        const contents = [
            ...genericHistory,
            { role: 'user', parts: [{ text: prompt }] }
        ];

        const config = {
            systemInstruction: systemPrompt,
        };

        // Enable thinking if a budget is provided (Only for Gemini 2.5 models)
        if (thinkingBudget > 0) {
            config.thinkingConfig = { thinkingBudget: thinkingBudget };
        }

        const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: config,
        });
        return response.text;

    } catch (error) {
        console.error(`Error al llamar a la API del modelo ${modelName}:`, error);
        return `[El DM (${modelName}) ha perdido la conexión con el plano material. Por favor intenta tu acción de nuevo.]`;
    }
};


// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'Usuario creado.', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
    }
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.', error: error.message });
  }
});


// --- GAME ROUTES ---

// Get all games for a user
app.get('/api/games', authenticateToken, async (req, res) => {
  try {
    const [games] = await db.execute('SELECT id, user_id, title, system_prompt, created_at FROM games WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las partidas.', error: error.message });
  }
});

// Delete a game
app.delete('/api/games/:id', authenticateToken, async (req, res) => {
    const gameId = req.params.id;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check ownership
        const [games] = await connection.execute('SELECT id FROM games WHERE id = ? AND user_id = ?', [gameId, req.user.id]);
        if (games.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Partida no encontrada o no autorizada.' });
        }

        // Delete messages first (foreign key constraint)
        await connection.execute('DELETE FROM messages WHERE game_id = ?', [gameId]);
        
        // Delete game
        await connection.execute('DELETE FROM games WHERE id = ?', [gameId]);

        await connection.commit();
        res.json({ message: 'Partida eliminada con éxito.' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error deleting game:', error);
        res.status(500).json({ message: 'Error al eliminar la partida.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Create a new randomized adventure concept
app.post('/api/games/randomize', authenticateToken, async (req, res) => {
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Genera un concepto para una aventura corta de Dungeons & Dragons. Proporciona un título creativo y un prompt de sistema detallado para un Dungeon Master. El prompt debe describir la escena inicial, el personaje del jugador (puedes inventar un nombre y clase), y el gancho inicial de la aventura. Responde únicamente en formato JSON.',
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Un título creativo y evocador para la aventura." },
                        prompt: { type: Type.STRING, description: "Un prompt de sistema detallado para que lo use un Dungeon Master de IA." }
                    },
                    required: ["title", "prompt"]
                },
            }
        });
        
        const responseText = result.text;
        if (!responseText) {
             throw new Error("La API de IA devolvió una respuesta vacía.");
        }
        const responseJson = JSON.parse(responseText);
        res.json(responseJson);

    } catch (error) {
        console.error('Error generating random adventure:', error);
        res.status(500).json({ message: 'No se pudo generar la inspiración. La musa está de vacaciones.', details: error.message });
    }
});

// Create a new game
app.post('/api/games', authenticateToken, async (req, res) => {
    const { title, system_prompt } = req.body;
    if (!title || !system_prompt) {
        return res.status(400).json({ message: 'Título y prompt son requeridos.' });
    }
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Create the game entry
        const [result] = await connection.execute(
            'INSERT INTO games (user_id, title, system_prompt) VALUES (?, ?, ?)',
            [req.user.id, title, system_prompt]
        );
        const gameId = result.insertId;

        // 2. Get initial responses from both DMs
        // DM 1: Budget 0 (Standard)
        // DM 2: Budget 1024 (Thinking enabled)
        const initialPrompt = "Comienza la aventura describiendo la escena inicial.";
        const [response1, response2] = await Promise.all([
            getAIResponse(DM_1_MODEL, system_prompt, [], initialPrompt, 0),
            getAIResponse(DM_2_MODEL, system_prompt, [], initialPrompt, 1024),
        ]);

        // 3. Save initial AI responses to DB
        await connection.execute('INSERT INTO messages (game_id, dm_version, sender, text) VALUES (?, ?, ?, ?)', [gameId, 1, 'ai', response1]);
        await connection.execute('INSERT INTO messages (game_id, dm_version, sender, text) VALUES (?, ?, ?, ?)', [gameId, 2, 'ai', response2]);

        // 4. Get the full game object to return
        const [rows] = await connection.execute('SELECT * FROM games WHERE id = ?', [gameId]);
        
        await connection.commit();
        res.status(201).json(rows[0]);

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error creating game:', error);
        res.status(500).json({ message: 'Error al crear la partida.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Get a single game's history
app.get('/api/games/:id/history', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [game] = await db.execute('SELECT * FROM games WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (game.length === 0) {
            return res.status(404).json({ message: 'Partida no encontrada o no autorizada.' });
        }
        const [messages] = await db.execute('SELECT * FROM messages WHERE game_id = ? ORDER BY created_at ASC', [id]);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial.', error: error.message });
    }
});


// Send an action to a game
app.post('/api/games/:id/action', authenticateToken, async (req, res) => {
    const gameId = req.params.id;
    const { action } = req.body;

    if (!action) {
        return res.status(400).json({ message: 'La acción no puede estar vacía.' });
    }
    
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Fetch game and history
        const [games] = await connection.execute('SELECT * FROM games WHERE id = ? AND user_id = ?', [gameId, req.user.id]);
        if (games.length === 0) {
             await connection.rollback();
             return res.status(404).json({ message: 'Partida no encontrada.' });
        }
        const game = games[0];
        
        const [historyRows] = await connection.execute('SELECT dm_version, sender, text FROM messages WHERE game_id = ? ORDER BY created_at ASC', [gameId]);

        // 2. Save user's action to DB for both DMs
        await connection.execute('INSERT INTO messages (game_id, dm_version, sender, text) VALUES (?, ?, ?, ?)', [gameId, 1, 'user', action]);
        await connection.execute('INSERT INTO messages (game_id, dm_version, sender, text) VALUES (?, ?, ?, ?)', [gameId, 2, 'user', action]);
        
        // 3. Call both AI models
        const callModel = async (modelName, dmVersion, budget) => {
            const historyForModel = historyRows
                .filter(m => m.dm_version === dmVersion)
                .map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));
            return getAIResponse(modelName, game.system_prompt, historyForModel, action, budget);
        };

        // DM 1: Standard (0 budget), DM 2: Thinking (1024 budget)
        const [response1, response2] = await Promise.all([
            callModel(DM_1_MODEL, 1, 0),
            callModel(DM_2_MODEL, 2, 1024),
        ]);

        // 4. Save AI responses to DB
        await connection.execute('INSERT INTO messages (game_id, dm_version, sender, text) VALUES (?, ?, ?, ?)', [gameId, 1, 'ai', response1]);
        await connection.execute('INSERT INTO messages (game_id, dm_version, sender, text) VALUES (?, ?, ?, ?)', [gameId, 2, 'ai', response2]);

        await connection.commit();

        // 5. Send back all new messages
        const [allNewMessages] = await db.execute('SELECT * FROM messages WHERE game_id = ? ORDER BY created_at ASC', [gameId]);
        res.json({ responses: allNewMessages });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error handling action:', error);
        res.status(500).json({ message: 'Error al procesar la acción.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});


// --- START SERVER ---
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});