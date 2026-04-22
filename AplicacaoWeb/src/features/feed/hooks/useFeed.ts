import { useState, useEffect } from 'react';
import { feedService } from '../services/feedService';

export function useFeed() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    const loadPosts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const currentOffset = posts.length;
            const data = await feedService.getFeed(LIMIT, currentOffset);

            if (data.length < LIMIT) {
                setHasMore(false);
            }

            setPosts((prev) => {
                const newPosts = data.filter(
                    (item) => !prev.some((p) => p.id === item.id && p.type === item.type),
                );
                return [...prev, ...newPosts];
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return {
        posts,
        loading,
        loadPosts,
        hasMore,
    };
}
