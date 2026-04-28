import { useState, useEffect } from 'react';
import { manualService } from '../services/manualService';
import { useRouter } from 'next/navigation';

export function useManual(id: string) {
    const [manual, setManual] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const loadManual = async () => {
            try {
                setLoading(true);
                const data = await manualService.getManualById(id);

                if (!data) {
                    router.push('/404');
                    return;
                }

                setManual(data);
            } catch (err) {
                router.push('/404');
            } finally {
                setLoading(false);
            }
        };

        loadManual();
    }, [id, router]);

    return { manual, loading, error };
}
