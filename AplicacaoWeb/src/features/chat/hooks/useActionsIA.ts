import { assistantService } from '../services/assistantService';
import { ChatMessageData } from './useAssistant';

interface UseActionsIAProps {
    idPublic: string | undefined;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>;
    setIsLoading: (loading: boolean) => void;
}

export const useActionsIA = ({ idPublic, setMessages, setIsLoading }: UseActionsIAProps) => {
    const handleCopy = async (text: string, onSuccess?: () => void) => {
        try {
            await navigator.clipboard.writeText(text);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
    };

    const handleSend = async (message: string) => {
        if (!message.trim() || !idPublic) return;

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: message,
            },
        ]);

        try {
            setIsLoading(true);

            const response = await assistantService.askIA({ message, idPublic });

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'ai',
                    content: response.content,
                    options: response.options,
                    metadata: response.metadata,
                    aiToken: response.aiToken,
                },
            ]);
        } catch (error) {
            console.error('Erro ao enviar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = async (lastUserMessage: string) => {
        if (!idPublic) return;

        try {
            setIsLoading(true);

            setMessages((prev) => {
                const newMessages = [...prev];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'ai') {
                    newMessages.pop();
                }
                return newMessages;
            });

            const response = await assistantService.retryIA(idPublic, lastUserMessage);

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'ai',
                    content: response.content,
                    options: response.options,
                    metadata: response.metadata,
                },
            ]);
        } catch (error) {
            console.error('Erro no retry:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!idPublic) return;
        try {
            await assistantService.cancelIA(idPublic);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao cancelar:', error);
        }
    };

    return { handleCopy, handleSend, handleRetry, handleCancel };
};
