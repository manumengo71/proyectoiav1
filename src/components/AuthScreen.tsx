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
        // Automatically log in after successful registration
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-parchment rounded-lg shadow-2xl p-8 border-4 border-amber-900/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-medieval text-stone-800 tracking-wider">
            El Comparador de DMs
          </h1>
          <p className="text-stone-600 mt-2 text-lg">
            {isLogin ? 'Ingresa a la taberna' : 'Forja tu leyenda'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-stone-700 mb-2">
              Nombre de Aventurero
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 bg-white/50 border-2 border-amber-800/50 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-shadow duration-200 text-stone-800"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-bold text-stone-700 mb-2">
              Contraseña Secreta
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-white/50 border-2 border-amber-800/50 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-shadow duration-200 text-stone-800"
            />
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-amber-500 transition-all duration-200 disabled:bg-gray-600 flex items-center justify-center text-xl"
          >
            {isLoading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
          </button>

          <p className="text-center text-sm text-stone-600">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya eres un aventurero?'}
            <button type="button" onClick={toggleForm} className="font-bold text-amber-700 hover:underline ml-2">
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
