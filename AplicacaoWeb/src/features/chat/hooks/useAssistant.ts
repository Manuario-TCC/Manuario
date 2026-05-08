import { useState } from 'react';
import { AIReference } from '../services/assistantService';

export type MessageRole = 'user' | 'ai';

export interface ChatMessageData {
    id: string;
    role: 'user' | 'ai';
    content: string;
    options?: string[];
    metadata?: {
        title: string;
        gameName: string;
    };
    references?: AIReference[];
    aiToken?: string;
}

export function useAssistant() {
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    return { messages, setMessages, isLoading, setIsLoading };
}
