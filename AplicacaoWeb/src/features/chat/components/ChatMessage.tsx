import { useState } from 'react';
import { useSession } from '../../../hooks/useSession';
import { ChatMessageData } from '../hooks/useAssistant';
import { useTypewriter } from '../hooks/useTypewriter';
import ChatMarkdown from './ChatMarkdown';
import { Bookmark, Share, RefreshCw, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
    message: ChatMessageData;
    onCopy: (text: string, onSuccess: () => void) => void;
    onRetry: () => void;
    onOptionSelect?: (optionText: string) => void;
    onPost?: () => void;
}

export default function ChatMessage({
    message,
    onCopy,
    onRetry,
    onOptionSelect,
    onPost,
}: ChatMessageProps) {
    const { user } = useSession();
    const isUser = message.role === 'user';
    const { displayedContent, isTyping } = useTypewriter(message.content, isUser);
    const [isCopied, setIsCopied] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleCopyClick = () => {
        onCopy(message.content, () => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
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
                            <div className="text-sm sm:text-base max-w-none flex flex-col">
                                <ChatMarkdown content={displayedContent} isTyping={isTyping} />

                                {message.options && message.options.length > 0 && !isTyping && (
                                    <div className="mt-5 flex flex-col gap-2 mb-2">
                                        <span className="text-xs text-sub-text mb-1 font-medium">
                                            Selecione uma opção:
                                        </span>

                                        {message.options.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const hasSelection = selectedOption !== null;

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={hasSelection}
                                                    onClick={() => {
                                                        setSelectedOption(option);

                                                        if (onOptionSelect) {
                                                            onOptionSelect(option);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-3 w-full text-left px-4 py-3 text-sm border rounded-xl transition-all 
                                                        ${
                                                            isSelected
                                                                ? 'bg-primary/10 border-primary text-primary font-medium'
                                                                : hasSelection
                                                                  ? 'bg-background border-card-border opacity-50 cursor-not-allowed text-sub-text'
                                                                  : 'bg-background border-card-border hover:border-primary hover:bg-primary/5 active:scale-[0.98] text-text group' // Estilo normal (antes de clicar)
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                                                            ${isSelected ? 'border-primary' : 'border-sub-text group-hover:border-primary'}
                                                        `}
                                                    >
                                                        <div
                                                            className={`w-2 h-2 rounded-full transition-colors 
                                                                ${isSelected ? 'bg-primary' : 'bg-transparent group-hover:bg-primary'}
                                                            `}
                                                        ></div>
                                                    </div>

                                                    <span>{option}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!isUser && !isTyping && (
                        <div className="flex items-center gap-1 mt-1.5 ml-2 text-sub-text animate-in fade-in duration-500">
                            <button
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Salvar"
                            >
                                <Bookmark className="w-[1rem] h-[1rem]" />
                            </button>

                            <button
                                onClick={onPost}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Postar"
                            >
                                <Share className="w-[1rem] h-[1rem]" />
                            </button>

                            <button
                                onClick={onRetry}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Gerar novamente"
                            >
                                <RefreshCw className="w-[1rem] h-[1rem]" />
                            </button>

                            <button
                                onClick={handleCopyClick}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95"
                                title="Copiar mensagem"
                            >
                                {isCopied ? (
                                    <Check className="text-primary w-[1rem] h-[1rem]" />
                                ) : (
                                    <Copy className="w-[1rem] h-[1rem]" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
