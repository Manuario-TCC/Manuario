import { useQuery } from '@tanstack/react-query';
import { postService } from '../services/postService';

export const useViewPost = (tipo: string, idPublic: string) => {
    const {
        data: post = null,
        isLoading: loading,
        isError: error,
    } = useQuery({
        queryKey: ['post', tipo, idPublic],
        queryFn: () => postService.getPostByIdPublic(tipo, idPublic),
        enabled: !!tipo && !!idPublic,
        retry: 1,
        staleTime: 1000 * 60,
    });

    return { post, loading, error };
};
