import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedService } from '../services/savedService';

export function useSavedSnippets() {
    const queryClient = useQueryClient();

    const {
        data: games,
        isLoading: isLoadingGames,
        isError: isErrorGames,
    } = useQuery({
        queryKey: ['saved-games-summary'],
        queryFn: savedService.getSavedGamesSummary,
    });

    const deleteMutation = useMutation({
        mutationFn: savedService.deleteSnippet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-games-summary'] });
            queryClient.invalidateQueries({ queryKey: ['saved-snippets'] });
        },
    });

    return {
        games: games || [],
        isLoadingGames,
        isErrorGames,
        deleteSnippet: deleteMutation.mutate,
    };
}

export function useInfiniteSavedSnippets(gameName: string) {
    const limit = 10;

    return useInfiniteQuery({
        queryKey: ['saved-snippets', gameName],
        queryFn: ({ pageParam = 0 }) =>
            savedService.getSavedSnippets(gameName, limit, pageParam as number),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === limit ? allPages.length * limit : undefined;
        },
        enabled: !!gameName,
    });
}
