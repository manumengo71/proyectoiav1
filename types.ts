export type Sender = 'user' | 'ai';

export interface Message {
  id?: number;
  game_id?: number;
  dm_version: 1 | 2;
  sender: Sender;
  text: string;
  created_at?: string;
}

export interface Game {
  id: number;
  user_id: number;
  system_prompt: string;
  created_at: string;
  title: string;
}

export interface User {
  id: number;
  username: string;
}
