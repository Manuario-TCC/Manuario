import { useState } from 'react';
import { useSession } from '../../../hooks/useSession';
import { ChatMessageData } from '../hooks/useAssistant';
import { useTypewriter } from '../hooks/useTypewriter';
import ChatMarkdown from './ChatMarkdown';
import { Bookmark, Share, RefreshCw, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
    message: ChatMessageData;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const { user } = useSession();
    const isUser = message.role === 'user';

    const { displayedContent, isTyping } = useTypewriter(message.content, isUser);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div
            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300`}
        >
            <div
                className={`flex max-w-[85%] sm:max-w-[75%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
                <div className="flex-shrink-0 z-20">
                    {isUser ? (
                        <img
                            src={user?.img || '/default-avatar.png'}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover shadow-sm bg-card"
                        />
                    ) : (
                        <img
                            src="/img/iconePadrao.jpg"
                            alt="AI"
                            className="w-8 h-8 rounded-full object-cover shadow-sm bg-card"
                        />
                    )}
                </div>

                <div className="relative mt-0 flex flex-col">
                    <div
                        className={`absolute top-0 ${isUser ? '-right-[7px] text-card' : '-left-[7px] text-card'} w-2 h-3 z-0`}
                    >
                        <svg viewBox="0 0 8 13" width="100%" height="100%" className="fill-current">
                            {isUser ? <path d="M0 0v13L8 0z" /> : <path d="M8 0v13L0 0z" />}
                        </svg>
                    </div>

                    <div
                        className={`relative z-10 px-5 py-3 shadow-sm bg-card text-text rounded-2xl ${
                            isUser ? 'rounded-tr-none' : 'rounded-tl-none'
                        }`}
                    >
                        {isUser ? (
                            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                                {message.content}
                            </p>
                        ) : (
                            <div className="text-sm sm:text-base max-w-none">
                                <ChatMarkdown content={displayedContent} isTyping={isTyping} />
                            </div>
                        )}
                    </div>

                    {!isUser && !isTyping && (
                        <div className="flex items-center gap-1 mt-1.5 ml-2 text-sub-text animate-in fade-in duration-500">
                            <button
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Salvar"
                            >
                                <Bookmark size={16} />
                            </button>

                            <button
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Postar"
                            >
                                <Share size={16} />
                            </button>

                            <button
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Gerar novamente"
                            >
                                <RefreshCw size={16} />
                            </button>

                            <button
                                onClick={handleCopy}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Copiar mensagem"
                            >
                                {isCopied ? (
                                    <Check size={16} className="text-primary" />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
