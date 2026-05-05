import { useQuery } from '@tanstack/react-query';
import { fetchSearchResults } from '../services/searchService';

export const useSearch = (query: string, type: string, filters: any) => {
    const hasQuery = query.trim().length > 0;
    const hasFilters = Object.keys(filters).length > 0;

    return useQuery({
        queryKey: ['search', query, type, filters],
        queryFn: () => fetchSearchResults(query, type, filters),
        enabled: hasQuery || hasFilters,
        staleTime: 0,
    });
};
