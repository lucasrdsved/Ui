import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { Send, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const Chat: React.FC = () => {
  const { currentUser, messages, sendMessage, users } = useAppStore();
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Identify the other party
  const otherUser = users.find(u => u.id !== currentUser?.id);

  // Filter messages for this conversation
  const conversation = messages.filter(m => 
    (m.senderId === currentUser?.id && m.receiverId === otherUser?.id) ||
    (m.senderId === otherUser?.id && m.receiverId === currentUser?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#F2F4F8]">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
        </button>
        <div className="relative">
            <img src={otherUser?.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
            <h2 className="font-bold text-gray-900">{otherUser?.name}</h2>
            <p className="text-xs text-gray-500">{otherUser?.type === 'trainer' ? 'Personal Trainer' : 'Student'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
                <div key={msg.id} className={clsx("flex w-full", isMe ? "justify-end" : "justify-start")}>
                    <div className={clsx(
                        "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                        isMe ? "bg-black text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
                    )}>
                        {msg.text}
                    </div>
                </div>
            );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 pb- safe border-t border-gray-100">
        <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2"
        >
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-2"
            />
            <button 
                type="submit"
                disabled={!inputText.trim()}
                className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50"
            >
                <Send size={14} />
            </button>
        </form>
      </div>
    </div>
  );
};