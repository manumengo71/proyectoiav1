import React, { useState, useEffect, useCallback } from 'react';
import { Game, Message } from '../types';
import ChatColumn from './ChatColumn';
import ActionInput from './ActionInput';
import { getGameHistory, sendGameAction } from '../services/apiService';
import DiceRoller from './DiceRoller';

interface GameScreenProps {
  game: Game;
  onGoToDashboard: () => void;
}

const DM_1_MODEL_NAME = 'Gemini 2.5 Flash (Rápido)';
const DM_2_MODEL_NAME = 'Gemini 2.5 Flash (Pensamiento)';

const GameScreen: React.FC<GameScreenProps> = ({ game, onGoToDashboard }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await getGameHistory(game.id);
      setMessages(history);
    } catch (err) {
      setError('No se pudo cargar el historial de la partida. Intenta volver al panel y reingresar.');
    } finally {
      setIsLoading(false);
    }
  }, [game.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSendAction = async (action: string) => {
    if (!action.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    // Optimistic update for immediate feedback
    const tempId = Date.now();
    const userMessage1: Message = { id: tempId, sender: 'user', text: action, dm_version: 1 };
    const userMessage2: Message = { id: tempId + 1, sender: 'user', text: action, dm_version: 2 };
    
    setMessages(prev => [...prev, userMessage1, userMessage2]);

    try {
      const { responses } = await sendGameAction(game.id, action);
      
      // El servidor devuelve el historial completo o los mensajes actualizados correctamente.
      // Si responses contiene TODO el historial (como está configurado en el server actual),
      // simplemente reemplazamos el estado.
      setMessages(responses);

    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al enviar la acción.');
      // Rollback: remove the optimistic messages if request fails
      setMessages(prev => prev.filter(m => m.id !== tempId && m.id !== tempId + 1));
    } finally {
      setIsLoading(false);
    }
  };
  
  const history1 = messages.filter(m => m.dm_version === 1);
  const history2 = messages.filter(m => m.dm_version === 2);

  return (
    <div className="flex flex-col h-screen p-2 md:p-4 gap-4 relative">
      <header className="flex-shrink-0 bg-dm-card rounded-lg p-3 shadow-lg flex justify-between items-center z-10">
        <h1 className="text-xl md:text-2xl font-medieval text-red-500 tracking-wider truncate mr-4">
          {game.title || "Crónicas de una Aventura"}
        </h1>
        <button 
          onClick={onGoToDashboard}
          className="bg-zinc-800 hover:bg-zinc-700 text-stone-300 font-bold py-2 px-3 text-xs md:text-sm rounded-md border border-zinc-600 transition-colors duration-200 whitespace-nowrap"
        >
          Salir
        </button>
      </header>

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-white p-2 text-center rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden gap-4">
        <ChatColumn title={`DM 1: ${DM_1_MODEL_NAME}`} messages={history1} />
        <ChatColumn title={`DM 2: ${DM_2_MODEL_NAME}`} messages={history2} />
      </main>

      <footer className="flex-shrink-0 p-3 rounded-lg bg-dm-card z-10">
        <ActionInput onSendAction={handleSendAction} isLoading={isLoading} />
      </footer>
      
      <DiceRoller />
    </div>
  );
};

export default GameScreen;