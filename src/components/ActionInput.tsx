import React, { useState } from 'react';
import { QuillIcon } from './icons/QuillIcon';

interface ActionInputProps {
  onSendAction: (action: string) => void;
  isLoading: boolean;
}

const ActionInput: React.FC<ActionInputProps> = ({ onSendAction, isLoading }) => {
  const [action, setAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action.trim() && !isLoading) {
      onSendAction(action);
      setAction('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder={isLoading ? "Los DMs están pensando..." : "Escribe tu acción aquí..."}
        disabled={isLoading}
        className="flex-grow bg-[#f5e8c8] border-2 border-amber-800/50 rounded-md p-3 focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition duration-200 text-stone-800 placeholder-stone-600/70 shadow-inner"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isLoading || !action.trim()}
        className="bg-amber-800 text-white font-bold p-3 rounded-full hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-amber-500 transition-all duration-200 disabled:bg-stone-600 disabled:cursor-not-allowed disabled:text-stone-400"
        aria-label="Enviar Acción"
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <QuillIcon />
        )}
      </button>
    </form>
  );
};

export default ActionInput;
