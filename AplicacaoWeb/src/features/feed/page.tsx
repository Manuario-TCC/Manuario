'use client';

import { useRef, useCallback, useMemo } from 'react';
import { useFeed } from './hooks/useFeed';
import DuvidaCard from '../../components/cards/DuvidaCard';
import RegraCard from '../../components/cards/RegraCard';

const PostSkeleton = () => (
    <div className="flex w-full animate-pulse flex-col p-4 border border-card-border rounded-xl bg-background shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-card-border/50" />
            <div className="flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-card-border/50" />
                <div className="h-3 w-24 rounded bg-card-border/50" />
            </div>
        </div>
        <div className="h-6 w-1/3 rounded bg-card-border/50 mb-3" />
        <div className="h-16 w-full rounded bg-card-border/50" />
    </div>
);

export default function FeedPage() {
    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useFeed();

    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading || isFetchingNextPage) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
    );

    const posts = useMemo(() => {
        return data?.pages.flatMap((page) => page) || [];
    }, [data]);

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 w-full flex flex-col items-center">
            <div className="flex flex-col gap-4 w-full">
                {posts.map((post, index) => {
                    const isLast = posts.length === index + 1;
                    const CardComponent = post.type === 'regra' ? RegraCard : DuvidaCard;
                    const postKey = `${post.type}-${post.id}-${index}`;

                    return (
                        <div
                            ref={isLast ? lastPostElementRef : null}
                            key={postKey}
                            className="w-full flex justify-center"
                        >
                            <CardComponent post={post} />
                        </div>
                    );
                })}
            </div>

            {(isLoading || isFetchingNextPage) && (
                <div className="flex flex-col gap-2 w-full mt-4">
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}

            {!isLoading && !hasNextPage && posts.length > 0 && (
                <div className="text-center text-sub-text py-10 text-sm">
                    Você chegou ao fim do feed.
                </div>
            )}
        </div>
    );
}
