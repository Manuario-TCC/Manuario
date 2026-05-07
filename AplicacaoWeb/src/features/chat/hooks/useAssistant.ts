import { useState } from 'react';

export type MessageRole = 'user' | 'ai';

export interface ChatMessageData {
    id: string;
    role: MessageRole;
    content: string;
    options?: string[];
    metadata?: {
        title?: string;
        gameName?: string;
    };
    aiToken?: string;
}

export function useAssistant() {
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    return { messages, setMessages, isLoading, setIsLoading };
}
