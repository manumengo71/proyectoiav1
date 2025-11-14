import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import GameScreen from './components/GameScreen';
import { Game } from './types';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'auth' | 'dashboard' | 'game'>('auth');
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setView('dashboard');
    } else {
      setView('auth');
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('auth');
    setCurrentGame(null);
  };

  const handleSelectGame = (game: Game) => {
    setCurrentGame(game);
    setView('game');
  };
  
  const handleNewGame = (game: Game) => {
    setCurrentGame(game);
    setView('game');
  };

  const handleGoToDashboard = () => {
    setCurrentGame(null);
    setView('dashboard');
  };

  const renderContent = () => {
    if (!token || view === 'auth') {
      return <AuthScreen onLogin={handleLogin} />;
    }
    switch (view) {
      case 'dashboard':
        return <DashboardScreen onSelectGame={handleSelectGame} onNewGame={handleNewGame} onLogout={handleLogout} />;
      case 'game':
        if (!currentGame) {
          // Should not happen, but as a fallback
          setView('dashboard');
          return null;
        }
        return <GameScreen game={currentGame} onGoToDashboard={handleGoToDashboard} />;
      default:
        return <AuthScreen onLogin={handleLogin} />;
    }
  };

  return <div className="min-h-screen">{renderContent()}</div>;
}

export default App;
