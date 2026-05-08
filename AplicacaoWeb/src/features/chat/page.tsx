'use client';

import { useEffect, useRef } from 'react';
import { useAssistant } from './hooks/useAssistant';
import { useActionsIA } from './hooks/useActionsIA';
import { useSession } from '../../hooks/useSession';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { MessageSquareDashed, ArrowLeft } from 'lucide-react';
import { usePostAI } from './hooks/usePostAI';
import PublishAIModal from './components/PublishAIModal';

export default function AssistantPage() {
    const { user } = useSession();
    const { messages, setMessages, isLoading, setIsLoading } = useAssistant();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isPostModalOpen, postData, openPostModal, closePostModal } = usePostAI();

    const { handleSend, handleCopy, handleRetry, handleCancel, handleSaveSnippet } = useActionsIA({
        idPublic: user?.idPublic,
        setMessages,
        setIsLoading,
    });

    const hasMessages = messages.length > 0;

    useEffect(() => {
        if (hasMessages) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, hasMessages]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isLoading && user?.idPublic) {
                const blob = new Blob([JSON.stringify({ idPublic: user.idPublic })], {
                    type: 'application/json',
                });

                navigator.sendBeacon('/api/chat/cancel', blob);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isLoading, user?.idPublic]);

    return (
        <div className="flex flex-col w-full bg-background text-text h-[calc(100dvh-8.5rem)] sm:h-screen overflow-hidden">
            {isPostModalOpen && (
                <PublishAIModal
                    isOpen={isPostModalOpen}
                    onClose={closePostModal}
                    promptUser={postData.promptUser}
                    aiResponse={postData.aiResponse}
                    initialTitle={postData.title}
                    initialGameName={postData.gameName}
                    aiToken={postData.aiToken}
                />
            )}

            {!hasMessages ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-700">
                    <div className="w-full max-w-3xl flex flex-col items-center">
                        <div className="mb-6 flex items-center justify-center shadow-lg rounded-full p-4 bg-card/50">
                            <MessageSquareDashed className="w-[3rem] h-[3rem] text-primary" />
                        </div>

                        <div className="max-w-lg mb-10">
                            <h1 className="text-2xl font-bold mb-4">Assistente do Manuário</h1>
                            <p className="text-sub-text leading-relaxed">
                                Todas as conversas que tiver no Manuário são temporárias. Caso
                                queira ver novamente a resposta lembre-se de salvar a resposta
                                clicando no botão de salvar e veja em{' '}
                                <strong className="text-text">‘’Salvos’’</strong> no perfil.
                            </p>
                        </div>

                        <div className="w-full">
                            <ChatInput
                                onSendMessage={handleSend}
                                onCancel={handleCancel}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full w-full">
                    <div className="w-full flex items-center px-4 py-3 bg-background shrink-0 shadow-sm z-10">
                        <button
                            onClick={() => {
                                if (isLoading) handleCancel();
                                setMessages([]);
                            }}
                            className="flex items-center gap-2 text-sm font-medium text-sub-text px-3 py-1.5 cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                            <span>Voltar ao início</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full p-4 md:p-6">
                        <div className="w-full max-w-4xl mx-auto pb-4">
                            {messages.map((msg, index) => {
                                const isLatestMessage = index === messages.length - 1;

                                const lastUserMsg =
                                    messages
                                        .slice(0, index)
                                        .reverse()
                                        .find((m) => m.role === 'user')?.content || '';

                                return (
                                    <ChatMessage
                                        key={msg.id}
                                        message={msg}
                                        isLatestMessage={isLatestMessage}
                                        onCopy={handleCopy}
                                        onRetry={() => handleRetry(lastUserMsg)}
                                        onOptionSelect={handleSend}
                                        onPost={() =>
                                            openPostModal(
                                                msg.content,
                                                lastUserMsg,
                                                msg.metadata,
                                                msg.aiToken,
                                            )
                                        }
                                        onSave={() =>
                                            handleSaveSnippet(
                                                lastUserMsg,
                                                msg.content,
                                                msg.metadata?.gameName,
                                            )
                                        }
                                    />
                                );
                            })}

                            {isLoading && (
                                <div className="flex w-full justify-start mb-6 animate-in fade-in duration-300">
                                    <div className="flex max-w-[85%] sm:max-w-[75%] gap-2 flex-row">
                                        <div className="flex-shrink-0">
                                            <img
                                                src="/img/iconePadrao.jpg"
                                                alt="AI"
                                                className="w-8 h-8 rounded-full object-cover shadow-sm bg-card"
                                            />
                                        </div>
                                        <div className="relative mt-0">
                                            <div className="absolute top-0 -left-[0.4rem] text-card w-2 h-3 z-0">
                                                <svg
                                                    viewBox="0 0 8 13"
                                                    width="100%"
                                                    height="100%"
                                                    className="fill-current"
                                                >
                                                    <path d="M8 0v13L0 0z" />
                                                </svg>
                                            </div>

                                            <div className="relative z-10 px-5 py-4 shadow-sm bg-card rounded-2xl rounded-tl-none flex items-center gap-1.5 h-[40px]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-typing-dot"></span>
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-typing-dot"
                                                    style={{ animationDelay: '0.2s' }}
                                                ></span>
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-typing-dot"
                                                    style={{ animationDelay: '0.4s' }}
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>

                    <div className="w-full bg-background pt-2 pb-6 px-4 shrink-0">
                        <div className="w-full max-w-3xl mx-auto">
                            <ChatInput
                                onSendMessage={handleSend}
                                onCancel={handleCancel}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
