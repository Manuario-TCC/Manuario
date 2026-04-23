import { useState, useEffect } from 'react';
import { postService } from '../services/postService';

export const useViewPost = (tipo: string, idPublico: string) => {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostByIdPublico(tipo, idPublico);
                setPost(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (tipo && idPublico) loadPost();
    }, [tipo, idPublico]);

    return { post, loading, error };
};
