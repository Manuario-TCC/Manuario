'use client';

import { useRef, useCallback } from 'react';
import { useFeed } from './hooks/useFeed';
import DuvidaCard from '../../components/cards/DuvidaCard';
import RegraCard from '../../components/cards/RegraCard';

export default function FeedPage() {
    const { posts, loading, loadPosts, hasMore } = useFeed();
    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadPosts();
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [loading, hasMore, loadPosts],
    );

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 w-full flex flex-col items-center">
            <div className="flex flex-col gap-4 w-full">
                {posts.map((post, index) => {
                    const isLast = posts.length === index + 1;
                    const CardComponent = post.type === 'regra' ? RegraCard : DuvidaCard;
                    const postKey = `${post.type}-${post.id}-${index}`;

                    if (isLast) {
                        return (
                            <div
                                ref={lastPostElementRef}
                                key={postKey}
                                className="w-full flex justify-center"
                            >
                                <CardComponent post={post} />
                            </div>
                        );
                    }
                    return <CardComponent key={postKey} post={post} />;
                })}
            </div>

            {loading && (
                <div className="text-center text-sub-text py-8 font-semibold">
                    Carregando postagens...
                </div>
            )}

            {!loading && !hasMore && posts.length > 0 && (
                <div className="text-center text-sub-text py-10 text-sm">
                    Você chegou ao fim do feed.
                </div>
            )}
        </div>
    );
}
