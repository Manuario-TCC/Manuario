import { useState } from 'react';
import { createManualService } from '../services/manualService';

export interface CreateManualData {
    title: string;
    game: string;
    genre?: string;
    system?: string;
    banner: File | null;
    logo: File | null;
}

export function useCreateManual() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitManual = async (data: CreateManualData) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('game', data.game);

            if (data.genre) {
                formData.append('genre', data.genre);
            }

            if (data.system) {
                formData.append('system', data.system);
            }

            if (data.banner) {
                formData.append('banner', data.banner);
            }

            if (data.logo) {
                formData.append('logo', data.logo);
            }

            const response = await createManualService(formData);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Erro ao criar o manual');
            }

            const result = await response.json();
            return result;
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        submitManual,
        isLoading,
        error,
    };
}
