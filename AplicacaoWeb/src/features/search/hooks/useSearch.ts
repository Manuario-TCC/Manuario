import { useQuery } from '@tanstack/react-query';
import { fetchSearchResults } from '../services/searchService';

export const useSearch = (query: string, type: string) => {
    return useQuery({
        queryKey: ['search', query, type],
        queryFn: () => fetchSearchResults(query, type),
        enabled: query.trim().length > 0,
        staleTime: 0,
    });
};
