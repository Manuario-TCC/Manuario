import { useState } from 'react';

export const useCommentInput = (
    onSubmit: (texto: string) => Promise<boolean>,
    onSuccess?: () => void,
    initialValue: string = '',
) => {
    const [texto, setTexto] = useState(initialValue);
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
