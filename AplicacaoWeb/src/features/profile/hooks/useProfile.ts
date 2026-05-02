import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';

export function useProfile(idPublic: string) {
    const queryClient = useQueryClient();

    const {
        data: profileData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['profile', idPublic],
        queryFn: () => profileService.getProfile(idPublic),
        retry: false,
    });

    const followMutation = useMutation({
        mutationFn: async () => {
            return profileService.toggleFollow(idPublic);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['profile', idPublic] });
            const previousProfile = queryClient.getQueryData(['profile', idPublic]);

            // Atualiza o cache
            queryClient.setQueryData(['profile', idPublic], (old: any) => {
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
                queryClient.setQueryData(['profile', idPublic], context.previousProfile);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', idPublic] });
        },
    });

    return {
        profileData,
        isLoading,
        isError,
        handleFollowToggle: () => followMutation.mutate(),
        isFollowing: profileData?.isFollowing,
    };
}
