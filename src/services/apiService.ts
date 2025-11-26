import { Game, Message } from '../types';

// Usamos un path relativo porque Vite está configurado con un proxy en vite.config.ts
// '/api' -> 'http://localhost:3001/api'
const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    try {
        const data = JSON.parse(text);
        throw new Error(data.message || 'Error en la petición a la API');
    } catch (e: any) {
        // Si no es JSON, lanzar el texto o el status
        throw new Error(e.message || text || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}

// --- AUTH ---

export const register = async (username: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

export const login = async (username: string, password: string): Promise<{ token: string; user: any }> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

// --- GAMES ---

export const getGames = async (): Promise<Game[]> => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const deleteGame = async (gameId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const createGame = async (title: string, system_prompt: string): Promise<Game> => {
    const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, system_prompt }),
    });
    return handleResponse(response);
};

export const getGameHistory = async (gameId: number): Promise<Message[]> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/history`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const sendGameAction = async (gameId: number, action: string): Promise<{ responses: Message[] }> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/action`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action }),
    });
    return handleResponse(response);
};

export const getRandomAdventure = async (): Promise<{ title: string; prompt: string }> => {
    const response = await fetch(`${API_BASE_URL}/games/randomize`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};