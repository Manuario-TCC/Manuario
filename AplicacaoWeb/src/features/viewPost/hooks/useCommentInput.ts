import { useState } from 'react';

export const useCommentInput = (
    onSubmit: (texto: string) => Promise<boolean>,
    onSuccess?: () => void,
) => {
    const [texto, setTexto] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!texto.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const success = await onSubmit(texto);

        if (success) {
            setTexto('');
            if (onSuccess) onSuccess();
        }
        setIsSubmitting(false);
    };

    return {
        texto,
        setTexto,
        isSubmitting,
        handleSubmit,
    };
};
