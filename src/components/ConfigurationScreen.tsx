import React, { useState } from 'react';
import { getRandomAdventure } from '../services/apiService';

interface ConfigurationScreenProps {
  onStartGame: (title: string, prompt: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

const DEFAULT_PROMPT = `Eres un Dungeon Master experto en Dungeons & Dragons. La aventura comienza en una taberna oscura y llena de humo llamada 'El Grifo Bostezando'. El jugador es un aventurero llamado 'Kaelen', un pícaro astuto con una inclinación por los problemas. Tu objetivo es describir la escena con detalle, crear un ambiente inmersivo y reaccionar a las acciones del jugador de manera creativa y coherente. Siempre debes terminar tus respuestas esperando la siguiente acción de Kaelen. Comienza ahora describiendo la escena inicial.`;

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({ onStartGame, onClose, isLoading }) => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [title, setTitle] = useState("Aventura en 'El Grifo Bostezando'");
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [randomizeError, setRandomizeError] = useState<string|null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && title.trim()) {
      onStartGame(title, prompt);
    }
  };

  const handleRandomize = async () => {
    setIsRandomizing(true);
    setRandomizeError(null);
    try {
        const { title: newTitle, prompt: newPrompt } = await getRandomAdventure();
        setTitle(newTitle);
        setPrompt(newPrompt);
    } catch (err: any) {
        setRandomizeError(err.message || 'Error al buscar inspiración.');
    } finally {
        setIsRandomizing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-parchment rounded-lg shadow-2xl p-8 border-2 border-amber-900/50 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-medieval text-stone-800 tracking-wider">
            Forjar una Nueva Aventura
          </h1>
          <p className="text-stone-600 mt-2 text-lg">
            Establece las crónicas que los DMs deberán narrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="mb-4">
            <label htmlFor="game-title" className="block text-lg font-bold text-stone-700 mb-2">
              Título de la Crónica
            </label>
            <input
              id="game-title"
              type="text"
              className="w-full p-3 bg-white/50 border-2 border-amber-800/50 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-shadow duration-200 text-stone-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: La Sombra sobre Insmouth"
            />
          </div>
          <div className="mb-6 flex-grow flex flex-col">
            <label htmlFor="system-prompt" className="block text-lg font-bold text-stone-700 mb-2">
              Decreto Inicial (Prompt)
            </label>
            <textarea
              id="system-prompt"
              className="w-full p-3 bg-white/50 border-2 border-amber-800/50 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-shadow duration-200 text-stone-800 resize-y flex-grow"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe aquí el prompt que ambas IAs usarán para guiar la aventura..."
            />
          </div>
          {randomizeError && <p className="text-red-600 text-center text-sm mb-4">{randomizeError}</p>}
          <div className="flex gap-4 mt-auto">
             <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isRandomizing}
              className="flex-1 bg-stone-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-stone-400 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              disabled={isLoading || isRandomizing}
              className="flex-1 bg-purple-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-purple-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isRandomizing ? 'Invocando...' : 'Buscar Inspiración'}
            </button>
            <button
              type="submit"
              disabled={isLoading || isRandomizing || !prompt.trim() || !title.trim()}
              className="flex-1 bg-amber-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-amber-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-xl"
            >
              {isLoading ? 'Forjando...' : 'Comenzar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationScreen;
