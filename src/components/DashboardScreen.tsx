import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../types';
import { getGames, createGame } from '../services/apiService';
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center">
       {isCreatingGame && (
        <ConfigurationScreen 
          onStartGame={handleStartGame}
          onClose={() => setIsCreatingGame(false)}
          isLoading={isLoading}
        />
      )}
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-medieval text-amber-300 tracking-wider">
            Sala de Aventuras
          </h1>
          <button
            onClick={onLogout}
            className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md border border-amber-900 transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </header>

        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-center mb-6">{error}</p>}
        
        <div className="bg-parchment rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center border-b-2 border-amber-900/30 pb-4 mb-4">
                 <h2 className="text-3xl font-medieval text-stone-800">Mis Crónicas</h2>
                 <button 
                    onClick={() => setIsCreatingGame(true)}
                    className="bg-amber-700 text-white font-bold py-2 px-5 rounded-md hover:bg-amber-600 transition-transform duration-200 hover:scale-105"
                 >
                    + Nueva Aventura
                </button>
            </div>

            {isLoading ? (
              <p className="text-center text-stone-600">Cargando crónicas...</p>
            ) : games.length === 0 ? (
              <p className="text-center text-stone-600 py-8">
                No has comenzado ninguna aventura. ¡Crea una para empezar!
              </p>
            ) : (
              <ul className="space-y-4">
                {games.map(game => (
                  <li 
                    key={game.id}
                    className="bg-white/40 rounded-md p-4 flex justify-between items-center border border-amber-800/20 hover:bg-amber-100/50 transition-colors duration-200"
                  >
                    <div>
                        <h3 className="text-xl font-bold text-stone-800">{game.title}</h3>
                        <p className="text-sm text-stone-600">
                            Iniciada: {new Date(game.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <button 
                        onClick={() => onSelectGame(game)}
                        className="bg-stone-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-stone-600 transition-colors duration-200"
                    >
                        Continuar Aventura
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
