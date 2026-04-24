import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';

export function useProfile(idPublico: string) {
    const queryClient = useQueryClient();

    const {
        data: profileData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['profile', idPublico],
        queryFn: () => profileService.getProfile(idPublico),
        retry: (failureCount, err) => err.message !== 'NOT_FOUND' && failureCount < 2,
    });

    const followMutation = useMutation({
        mutationFn: async () => {
            return profileService.toggleFollow(idPublico);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['profile', idPublico] });
            const previousProfile = queryClient.getQueryData(['profile', idPublico]);

            // Atualiza o cache
            queryClient.setQueryData(['profile', idPublico], (old: any) => {
                if (!old) return old;

                const isNowFollowing = !old.isFollowing;
                return {
                    ...old,
                    isFollowing: isNowFollowing,
                    followers: isNowFollowing ? old.followers + 1 : old.followers - 1,
                };
            });

            return { previousProfile };
        },
        onError: (err, variables, context) => {
            console.error('Erro ao seguir/deixar de seguir:', err);
            if (context?.previousProfile) {
                queryClient.setQueryData(['profile', idPublico], context.previousProfile);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', idPublico] });
        },
    });

    return {
        profileData,
        isLoading,
        isNotFound: error?.message === 'NOT_FOUND',
        handleFollowToggle: () => followMutation.mutate(),
        isFollowing: profileData?.isFollowing,
    };
}
