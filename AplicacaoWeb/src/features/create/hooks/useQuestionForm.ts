import { useState, useMemo } from 'react';

export function useQuestionForm() {
    const [data, setData] = useState({
        title: '',
        game: '',
        description: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const isValid = useMemo(() => {
        return (
            data.title?.trim() !== '' && data.game?.trim() !== '' && data.description?.trim() !== ''
        );
    }, [data]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            console.log('Enviando Dúvida:', data);
        } finally {
            setIsLoading(false);
        }
    };

    return { data, setData, isValid, handleSubmit, isLoading };
}
