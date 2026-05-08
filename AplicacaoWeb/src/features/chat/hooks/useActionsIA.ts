import { assistantService } from '../services/assistantService';
import { snippetService } from '../services/snippetService';
import { ChatMessageData } from './useAssistant';
import { customAlert } from '@/src/components/customAlert';

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
            { id: crypto.randomUUID(), role: 'user', content: message },
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
                    references: response.references,
                },
            ]);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Requisição abortada pelo usuário.');
            } else {
                console.error('Erro ao enviar:', error);
            }
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
                    aiToken: response.aiToken,
                    references: response.references,
                },
            ]);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Requisição de Retry abortada.');
            } else {
                console.error('Erro no retry:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!idPublic) return;
        try {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'ai',
                    content: 'Processo cancelado!',
                },
            ]);

            await assistantService.cancelIA(idPublic);
        } catch (error) {
            console.error('Erro ao cancelar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSnippet = async (prompt: string, response: string, gameName?: string) => {
        try {
            await snippetService.save({
                promptUser: prompt,
                aiResponse: response,
                gameName: gameName,
            });
            customAlert.toastSuccess('Trecho salvo no seu perfil!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            customAlert.toastError('Erro ao salvar o trecho.');
        }
    };

    return {
        handleCopy,
        handleSend,
        handleRetry,
        handleCancel,
        handleSaveSnippet,
    };
};
