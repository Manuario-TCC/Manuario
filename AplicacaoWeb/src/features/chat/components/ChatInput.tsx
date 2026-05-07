import React, { useState } from 'react';
import { SendHorizontal, Square } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full px-4 md:px-0">
            <div className="relative flex items-center group bg-card border border-card-border rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 shadow-lg">
                <input
                    id="chat-assistant-input"
                    type="text"
                    autoComplete="off"
                    placeholder="Pergunte sobre as regras de qualquer jogo..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent py-4 pl-6 pr-14 text-text placeholder:text-sub-text focus:outline-none text-base"
                />

                <button
                    type="submit"
                    disabled={isLoading || !text.trim()}
                    className="absolute right-3 p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl disabled:opacity-30 transition-all flex items-center justify-center active:scale-95"
                >
                    {isLoading ? <Square size={20} /> : <SendHorizontal size={20} />}
                </button>
            </div>
        </form>
    );
}
