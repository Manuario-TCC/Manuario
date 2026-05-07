import { useState } from 'react';
import { publishAIService } from '../services/publishAIService';
import { customAlert } from '@/src/components/customAlert';

export function usePublishAI({
    initialTitle,
    initialGameName,
    promptUser,
    aiResponse,
    aiToken,
    idPublicUser,
    onSuccess,
}: any) {
    const [title, setTitle] = useState(initialTitle);
    const [gameName, setGameName] = useState(initialGameName);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            await publishAIService.publish({
                title,
                gameName,
                aiToken,
                idPublicUser,
            });

            customAlert.toastSuccess('Publicado no Manuário com sucesso!');
            onSuccess();
        } catch (error) {
            customAlert.toastError('Erro ao publicar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        title,
        setTitle,
        gameName,
        setGameName,
        isSubmitting,
        handlePublish,
    };
}
