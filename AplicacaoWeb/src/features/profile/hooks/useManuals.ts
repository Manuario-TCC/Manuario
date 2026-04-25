import { useInfiniteQuery } from '@tanstack/react-query';
import { manualsService } from '../services/manualsService';

export interface ManualResponse {
    items: any[];
    nextOffset?: number | null;
}

export function useManuals(idPublico: string) {
    const limit = 12;

    return useInfiniteQuery<ManualResponse, Error>({
        queryKey: ['user-manuals', idPublico],
        queryFn: ({ pageParam = 0 }) =>
            manualsService.getUserManuals(idPublico, limit, pageParam as number),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
        enabled: !!idPublico,
    });
}
