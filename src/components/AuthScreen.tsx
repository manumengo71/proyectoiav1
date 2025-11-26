
import React, { useState } from 'react';
import { login, register } from '../services/apiService';

interface AuthScreenProps {
  onLogin: (token: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { token } = await login(username, password);
        onLogin(token);
      } else {
        await register(username, password);
        const { token } = await login(username, password);
        onLogin(token);
      }
    } catch (err: any) {
      setError(err.message || `Error durante ${isLogin ? 'el inicio de sesión' : 'el registro'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md bg-dm-card p-8 rounded-xl relative z-10 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8 border-b border-white/10 pb-6">
          <h1 className="text-4xl sm:text-5xl font-medieval text-red-500 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Dungeon Master
          </h1>
          <h2 className="text-lg font-medieval text-stone-400 mt-2 uppercase tracking-widest opacity-80">
            Comparador de IA
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xs font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">
              Nombre de Aventurero
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-dm"
              placeholder="Ej: Gandalf el Gris"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-xs font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-dm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-900 text-red-400 text-center text-sm p-3 rounded">
                {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-dm-primary font-bold py-3 px-4 rounded font-medieval text-xl tracking-wide mt-4"
          >
            {isLoading ? 'Conjurando...' : (isLogin ? 'Entrar al Reino' : 'Crear Personaje')}
          </button>

          <div className="text-center mt-6 pt-4 border-t border-white/5">
            <p className="text-sm text-stone-500">
              {isLogin ? '¿Aún no tienes historia?' : '¿Ya eres un veterano?'}
              <button type="button" onClick={toggleForm} className="font-bold text-red-500 hover:text-red-400 hover:underline ml-2 transition-colors">
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;