import { useState } from 'react';
import { useSession } from '../../../hooks/useSession';
import { ChatMessageData } from '../hooks/useAssistant';
import { useTypewriter } from '../hooks/useTypewriter';
import ChatMarkdown from './ChatMarkdown';
import { Bookmark, Share, RefreshCw, Copy, Check, Book } from 'lucide-react';
import ReferencesModal from './ReferencesModal';

interface ChatMessageProps {
    message: ChatMessageData;
    isLatestMessage: boolean;
    onCopy: (text: string, onSuccess: () => void) => void;
    onRetry: () => void;
    onOptionSelect?: (optionText: string) => void;
    onPost?: () => void;
    onSave?: () => void;
}

export default function ChatMessage({
    message,
    isLatestMessage,
    onCopy,
    onRetry,
    onOptionSelect,
    onPost,
    onSave,
}: ChatMessageProps) {
    const { user } = useSession();
    const isUser = message.role === 'user';

    let cleanContent = message.content;
    if (cleanContent) {
        cleanContent = cleanContent.replace(/\\n/g, '\n');
        cleanContent = cleanContent.replace(/^"|"$/g, '');
    }

    const { displayedContent, isTyping } = useTypewriter(cleanContent, isUser);

    const [isCopied, setIsCopied] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isRefModalOpen, setIsRefModalOpen] = useState(false);

    const handleCopyClick = () => {
        onCopy(cleanContent, () => {
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
                <div className="flex-shrink-0">
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
                        className={`relative px-5 py-3 shadow-sm bg-card text-text rounded-2xl ${
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

                                {message.references &&
                                    message.references.length > 0 &&
                                    !isTyping && (
                                        <div className="mt-4 pt-4 border-t border-card-border/50">
                                            <button
                                                onClick={() => setIsRefModalOpen(true)}
                                                className="flex items-center gap-2 text-xs sm:text-sm text-sub-text bg-background/50 hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-card-border hover:border-primary/30 transition-all active:scale-95 cursor-pointer"
                                            >
                                                <Book size={14} />
                                                <span>
                                                    Baseado em {message.references.length} fonte(s)
                                                </span>
                                            </button>

                                            <ReferencesModal
                                                isOpen={isRefModalOpen}
                                                onClose={() => setIsRefModalOpen(false)}
                                                references={message.references}
                                            />
                                        </div>
                                    )}

                                {message.options && message.options.length > 0 && !isTyping && (
                                    <div className="mt-5 flex flex-col gap-2 mb-2">
                                        <span className="text-xs text-sub-text mb-1 font-medium">
                                            Selecione uma opção:
                                        </span>

                                        {message.options.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const hasSelection =
                                                selectedOption !== null || !isLatestMessage;

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
                                onClick={onSave}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95 cursor-pointer"
                                title="Salvar Trecho"
                            >
                                <Bookmark className="w-[1rem] h-[1rem]" />
                            </button>

                            <button
                                onClick={onPost}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95 cursor-pointer"
                                title="Postar"
                            >
                                <Share className="w-[1rem] h-[1rem]" />
                            </button>

                            <button
                                onClick={onRetry}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95 cursor-pointer"
                                title="Gerar novamente"
                            >
                                <RefreshCw className="w-[1rem] h-[1rem]" />
                            </button>

                            <button
                                onClick={handleCopyClick}
                                className="p-1.5 hover:text-text hover:bg-card/60 rounded-md transition-all active:scale-95 cursor-pointer"
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
