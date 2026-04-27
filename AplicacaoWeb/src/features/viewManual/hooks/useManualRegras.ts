import { useState, useEffect } from 'react';
import { manualService } from '../services/manualService';

export function useManualRegras(manualId: string) {
    const [regras, setRegras] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingRegras, setLoadingRegras] = useState(false);

    useEffect(() => {
        if (!manualId) return;

        const fetchInitialRegras = async () => {
            setLoadingRegras(true);
            try {
                const data = await manualService.getRegrasByManualId(manualId, 1, searchQuery);
                setRegras(data.regras);
                setHasMore(data.hasMore);
                setPage(1);
            } catch (err) {
                console.error('Erro ao buscar regras iniciais', err);
            } finally {
                setLoadingRegras(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchInitialRegras();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, manualId]);

    const loadMore = async () => {
        if (!hasMore || loadingRegras) return;

        const nextPage = page + 1;
        setLoadingRegras(true);

        try {
            const data = await manualService.getRegrasByManualId(manualId, nextPage, searchQuery);
            setRegras((prev) => [...prev, ...data.regras]);
            setHasMore(data.hasMore);
            setPage(nextPage);
        } catch (err) {
            console.error('Erro ao carregar mais regras', err);
        } finally {
            setLoadingRegras(false);
        }
    };

    return {
        regras,
        searchQuery,
        setSearchQuery,
        hasMore,
        loadingRegras,
        loadMore,
    };
}
