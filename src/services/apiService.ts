import { Game, Message } from '../types';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición a la API');
  }
  return data;
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
