import { useState, useEffect } from 'react';
import { manualService } from '../services/manualService';

export function useManual(id: string) {
    const [manual, setManual] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadManual = async () => {
            try {
                setLoading(true);
                const data = await manualService.getManualById(id);
                setManual(data);
            } catch (err) {
                setError('Não foi possível carregar os dados do manual.');
            } finally {
                setLoading(false);
            }
        };

        loadManual();
    }, [id]);

    return { manual, loading, error };
}
