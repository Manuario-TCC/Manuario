'use client';

import { useEffect, useRef } from 'react';
import { useAssistant } from './hooks/useAssistant';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { MessageSquareDashed } from 'lucide-react';

export default function AssistantPage() {
    const { messages, isLoading, sendMessage } = useAssistant();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const hasMessages = messages.length > 0;

    useEffect(() => {
        if (hasMessages) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading, hasMessages]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] w-full bg-background text-text">
            {!hasMessages ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center animate-in fade-in duration-700">
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
                            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-32">
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}

                        {isLoading && (
                            <div className="flex w-full justify-start mb-6 animate-in fade-in duration-300">
                                <div className="flex max-w-[85%] sm:max-w-[75%] gap-2 flex-row">
                                    <div className="flex-shrink-0 z-20">
                                        <img
                                            src="/img/iconePadrao.jpg"
                                            alt="AI"
                                            className="w-8 h-8 rounded-full object-cover shadow-sm bg-card"
                                        />
                                    </div>
                                    <div className="relative mt-0">
                                        <div className="absolute top-0 -left-[7px] text-card w-2 h-3 z-0">
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
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="sticky bottom-0 w-full bg-background/95 backdrop-blur-md pb-6 z-30">
                        <div className="w-full max-w-3xl mx-auto">
                            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
