import { useState } from 'react';
import { assistantService } from '../services/assistantService';

export type MessageRole = 'user' | 'ai';

export interface ChatMessageData {
    id: string;
    role: MessageRole;
    content: string;
}

export function useAssistant() {
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: ChatMessageData = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const aiResponseContent = await assistantService.askIA({ message: text });

            const aiMessage: ChatMessageData = {
                id: crypto.randomUUID(),
                role: 'ai',
                content: aiResponseContent,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Erro ao consultar a IA', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage,
    };
}
