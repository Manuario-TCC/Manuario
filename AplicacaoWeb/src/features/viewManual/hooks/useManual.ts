import { useQuery } from '@tanstack/react-query';
import { manualService } from '../services/manualService';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useManual(id: string) {
    const router = useRouter();

    const {
        data: manual = null,
        isLoading: loading,
        isError,
    } = useQuery({
        queryKey: ['manual', id],
        queryFn: () => manualService.getManualById(id),
        enabled: !!id,
        retry: false,
    });

    useEffect(() => {
        if (!loading && (!manual || isError)) {
            router.push('/404');
        }
    }, [manual, isError, loading, router]);

    return {
        manual,
        loading,
    };
}
