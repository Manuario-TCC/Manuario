import { useState, useEffect } from 'react';
import { postService } from '../services/postService';

export const useViewPost = (tipo: string, idPublic: string) => {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostByIdPublic(tipo, idPublic);
                setPost(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (tipo && idPublic) loadPost();
    }, [tipo, idPublic]);

    return { post, loading, error };
};
