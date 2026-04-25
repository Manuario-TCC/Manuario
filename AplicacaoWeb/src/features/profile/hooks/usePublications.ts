import { useInfiniteQuery } from '@tanstack/react-query';
import { publicationsService } from '../services/publicationsService';

type SubTabType = 'duvida' | 'regra' | 'ia';

export interface PublicationsResponse {
    items?: any[];
    nextOffset?: number | null;
}

export function usePublications(idPublico: string, activeTab: SubTabType) {
    const limit = 10;

    return useInfiniteQuery<PublicationsResponse, Error>({
        queryKey: ['user-posts', idPublico, activeTab],
        queryFn: ({ pageParam }) =>
            publicationsService.getUserPosts(idPublico, activeTab, limit, pageParam as number),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
        enabled: activeTab !== 'ia',
    });
}
