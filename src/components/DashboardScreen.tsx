import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../types';
import { getGames, createGame, deleteGame } from '../services/apiService';
import ConfigurationScreen from './ConfigurationScreen';

interface DashboardScreenProps {
  onSelectGame: (game: Game) => void;
  onNewGame: (game: Game) => void;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onSelectGame, onNewGame, onLogout }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      setIsLoading(true);
      const userGames = await getGames();
      setGames(userGames);
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar las partidas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);
  
  const handleStartGame = async (title: string, prompt: string) => {
    setIsLoading(true);
    try {
      const newGame = await createGame(title, prompt);
      onNewGame(newGame);
    } catch (err: any) {
       setError(err.message || 'No se pudo crear la partida.');
    } finally {
        setIsLoading(false);
        setIsCreatingGame(false);
    }
  };

  const handleDeleteGame = async (e: React.MouseEvent, gameId: number) => {
    e.stopPropagation(); // Prevent entering the game when clicking delete
    if (window.confirm('¿Estás seguro de que quieres quemar estos pergaminos? La historia se perderá para siempre.')) {
        try {
            await deleteGame(gameId);
            setGames(prev => prev.filter(g => g.id !== gameId));
        } catch (err: any) {
            alert('No se pudo borrar la partida: ' + err.message);
        }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center">
       {isCreatingGame && (
        <ConfigurationScreen 
          onStartGame={handleStartGame}
          onClose={() => setIsCreatingGame(false)}
          isLoading={isLoading}
        />
      )}
      <div className="w-full max-w-5xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-red-900/40 pb-6 gap-4">
          <div className="text-center sm:text-left">
              <h1 className="text-4xl md:text-5xl font-medieval text-red-600 tracking-wider drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                Sala de Crónicas
              </h1>
              <p className="text-stone-500 mt-2 font-italic">Selecciona un destino o forja uno nuevo.</p>
          </div>
          <button
            onClick={onLogout}
            className="btn-dm-secondary py-2 px-4 rounded-md text-sm uppercase tracking-widest hover:border-red-800"
          >
            Cerrar Sesión
          </button>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-950/40 border-l-4 border-red-600 rounded text-red-200">
                {error}
            </div>
        )}
        
        <div className="mb-8 flex justify-end">
             <button 
                onClick={() => setIsCreatingGame(true)}
                className="btn-dm-primary font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transform transition-transform shadow-xl flex items-center gap-2"
             >
                <span className="text-2xl font-medieval">+</span> Nueva Aventura
            </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="bg-dm-card rounded-xl p-12 text-center border-2 border-dashed border-zinc-800">
            <h3 className="text-2xl font-medieval text-stone-400 mb-4">El grimorio está vacío</h3>
            <p className="text-stone-500 mb-6">No hay historias escritas aún. La aventura aguarda.</p>
            <button 
                onClick={() => setIsCreatingGame(true)}
                className="text-red-500 hover:text-red-400 underline"
            >
                Crear tu primera historia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <div 
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group relative bg-dm-card rounded-xl p-6 cursor-pointer overflow-hidden border border-zinc-800 hover:border-red-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] flex flex-col justify-between h-56"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-900/20 to-transparent pointer-events-none rounded-tr-xl"></div>

                <div>
                    <h3 className="text-xl font-medieval text-stone-200 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight mb-2">
                        {game.title}
                    </h3>
                    <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">
                        {new Date(game.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="w-12 h-1 bg-red-900/50 group-hover:w-full transition-all duration-500"></div>
                </div>

                <div className="flex justify-between items-end mt-4">
                    <span className="text-xs text-stone-600 group-hover:text-stone-400 transition-colors">
                        Clic para jugar
                    </span>
                    <button 
                        onClick={(e) => handleDeleteGame(e, game.id)}
                        className="text-stone-600 hover:text-red-500 p-2 rounded-full hover:bg-black/50 transition-colors z-10"
                        title="Borrar Partida"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;