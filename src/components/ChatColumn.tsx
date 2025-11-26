
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatColumnProps {
  title: string;
  messages: Message[];
}

const ChatColumn: React.FC<ChatColumnProps> = ({ title, messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-zinc-900/50 rounded-lg border-2 border-zinc-800 overflow-hidden shadow-inner">
      <h2 className="text-center font-medieval text-lg p-2 bg-zinc-950/80 border-b border-zinc-800 text-stone-300 tracking-wider">
        {title}
      </h2>
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-black/20 scrollbar-thin">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatColumn;
