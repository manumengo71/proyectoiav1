import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { sender, text } = message;
  const isUser = sender === 'user';

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  
  // A single style for the bubble but the alignment changes
  const bubbleClasses = 'bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-md border border-amber-900/20';

  const nameClasses = isUser ? 'text-amber-400 font-medieval' : 'text-stone-300 font-bold';

  return (
    <div className={wrapperClasses}>
      <div className={`p-4 max-w-lg lg:max-w-xl ${bubbleClasses}`}>
        <p className={`mb-2 text-sm ${nameClasses}`}>
          {isUser ? 'Kaelen (Tú)' : 'Dungeon Master'}
        </p>
        <p className="whitespace-pre-wrap text-white leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
