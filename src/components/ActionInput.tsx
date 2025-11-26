
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
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full max-w-5xl mx-auto">
      <div className="relative flex-grow group">
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder={isLoading ? "El destino se está escribiendo..." : "Describe tu siguiente acción..."}
          disabled={isLoading}
          className="input-dm w-full pl-5 pr-4 py-4 text-lg rounded-xl"
          autoComplete="off"
        />
        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-xl pointer-events-none transition-opacity opacity-0 group-focus-within:opacity-100 shadow-[0_0_20px_rgba(220,38,38,0.2)]"></div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !action.trim()}
        className="btn-dm-primary p-4 rounded-xl flex-shrink-0 flex items-center justify-center group w-16 h-16"
        aria-label="Enviar Acción"
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6 text-red-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="transform group-hover:scale-110 transition-transform text-white">
             <QuillIcon />
          </div>
        )}
      </button>
    </form>
  );
};

export default ActionInput;