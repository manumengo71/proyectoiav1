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
    <div className="flex-1 flex flex-col bg-black/30 rounded-lg border-2 border-amber-900/50 overflow-hidden shadow-inner shadow-black/50">
      <h2 className="text-center font-medieval text-xl p-3 bg-black/50 border-b-2 border-amber-900/50 text-amber-300 tracking-wider">
        {title}
      </h2>
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-parchment/10">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatColumn;
