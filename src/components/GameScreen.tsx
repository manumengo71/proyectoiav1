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

const DM_1_MODEL_NAME = 'gemini-2.5-flash';
const DM_2_MODEL_NAME = 'gemini-2.5-pro';

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
    
    // Optimistically update UI
    const userMessage1: Message = { sender: 'user', text: action, dm_version: 1 };
    const userMessage2: Message = { sender: 'user', text: action, dm_version: 2 };
    setMessages(prev => [...prev, userMessage1, userMessage2]);

    try {
      const { responses } = await sendGameAction(game.id, action);
      // Replace optimistic update with real data from server
      setMessages(prev => {
        const nonUserMessages = prev.filter(m => m.sender !== 'user');
        return [...nonUserMessages, ...responses];
      });
      // A more robust solution would be to refetch, but this is faster.
      await loadHistory();

    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al enviar la acción.');
      // Rollback optimistic update on error
      setMessages(prev => prev.slice(0, -2));
    } finally {
      setIsLoading(false);
    }
  };
  
  const history1 = messages.filter(m => m.dm_version === 1);
  const history2 = messages.filter(m => m.dm_version === 2);

  return (
    <div className="flex flex-col h-screen p-4 gap-4 relative">
      <header className="flex-shrink-0 bg-black/40 border-2 border-amber-900/60 rounded-lg p-3 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-medieval text-amber-300 tracking-wider">
          {game.title || "Crónicas de una Aventura"}
        </h1>
        <button 
          onClick={onGoToDashboard}
          className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md border border-amber-900 transition-colors duration-200 text-sm"
        >
          Volver a la Sala
        </button>
      </header>

      {error && (
        <div className="bg-red-900/80 border border-red-600 text-white p-3 text-center rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden gap-4">
        <ChatColumn title={`DM 1 (${DM_1_MODEL_NAME})`} messages={history1} />
        <ChatColumn title={`DM 2 (${DM_2_MODEL_NAME})`} messages={history2} />
      </main>

      <footer className="flex-shrink-0 p-4 rounded-lg bg-black/40 border-2 border-amber-900/60">
        <ActionInput onSendAction={handleSendAction} isLoading={isLoading} />
      </footer>
      
      <DiceRoller />
    </div>
  );
};

export default GameScreen;
