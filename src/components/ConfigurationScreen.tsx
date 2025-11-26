
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
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md transition-all">
      <div className="bg-dm-card rounded-lg p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-[0_0_60px_rgba(127,29,29,0.2)]">
        
        {/* Header */}
        <div className="text-center mb-6 relative z-10 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-medieval text-red-500 tracking-wider">
            Forjar Nueva Aventura
          </h1>
          <p className="text-stone-400 mt-2 text-sm">
            Establece los parámetros del mundo que vas a crear.
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden relative z-10 gap-6">
          <div>
            <label htmlFor="game-title" className="block text-xs font-bold text-stone-300 mb-2 uppercase tracking-wide ml-1">
              Título de la Crónica
            </label>
            <input
              id="game-title"
              type="text"
              className="input-dm text-lg font-medieval tracking-wide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: La Sombra sobre Insmouth"
            />
          </div>
          
          <div className="flex-grow flex flex-col min-h-0">
            <label htmlFor="system-prompt" className="block text-xs font-bold text-stone-300 mb-2 uppercase tracking-wide ml-1">
              Decreto Inicial (Prompt del Sistema)
            </label>
            <textarea
              id="system-prompt"
              className="input-dm resize-none flex-grow h-40 font-mono text-sm leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Escribe aquí el prompt que ambas IAs usarán para guiar la aventura..."
            />
          </div>

          {randomizeError && (
             <div className="bg-red-950/50 text-red-400 text-center text-sm p-2 rounded border border-red-900/50">
                {randomizeError}
             </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
             <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isRandomizing}
              className="flex-1 bg-transparent text-stone-400 font-bold py-3 px-4 rounded border border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              disabled={isLoading || isRandomizing}
              className="flex-1 bg-purple-900/30 text-purple-200 font-bold py-3 px-4 rounded border border-purple-800/50 hover:bg-purple-900/50 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-200 flex items-center justify-center"
            >
              {isRandomizing ? 'Invocando...' : '✨ Inspiración Divina'}
            </button>
            <button
              type="submit"
              disabled={isLoading || isRandomizing || !prompt.trim() || !title.trim()}
              className="flex-1 btn-dm-primary font-bold py-3 px-4 rounded font-medieval text-lg"
            >
              {isLoading ? 'Forjando...' : 'Comenzar Partida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationScreen;
