import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { manualService } from '../services/manualService';
import { useDebounce } from '@/src/hooks/useDebounce';

export function useManualRegras(manualId: string) {
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedQuery = useDebounce(searchQuery, 500);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['manual-rules', manualId, debouncedQuery],
        queryFn: ({ pageParam = 1 }) =>
            manualService.getRegrasByManualId(manualId, pageParam as number, debouncedQuery),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.hasMore) {
                return undefined;
            }

            return allPages.length + 1;
        },
        enabled: !!manualId,
    });

    // Agrupa array de regras
    const rules = useMemo(() => {
        return data?.pages.flatMap((page) => page.rules) || [];
    }, [data]);

    return {
        rules,
        searchQuery,
        setSearchQuery,
        hasMore: hasNextPage,
        loadingRegras: isLoading || isFetchingNextPage,
        loadMore: fetchNextPage,
    };
}
