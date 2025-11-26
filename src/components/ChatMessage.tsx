
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { sender, text } = message;
  const isUser = sender === 'user';

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  
  // Dark theme bubbles
  const userBubble = 'bg-red-900/20 border-red-900/50 text-stone-200';
  const aiBubble = 'bg-zinc-800/80 border-zinc-700 text-stone-300';
  
  const bubbleClasses = `backdrop-blur-sm rounded-lg shadow-md border p-4 max-w-[90%] lg:max-w-xl ${isUser ? userBubble : aiBubble}`;

  const nameClasses = isUser ? 'text-red-400 font-medieval' : 'text-stone-400 font-bold';

  return (
    <div className={wrapperClasses}>
      <div className={bubbleClasses}>
        <p className={`mb-1 text-xs uppercase tracking-wide ${nameClasses}`}>
          {isUser ? 'Tú' : 'Dungeon Master'}
        </p>
        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
