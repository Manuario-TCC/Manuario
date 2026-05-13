'use client';

import { useRef, useCallback, useMemo } from 'react';
import { useFeed } from './hooks/useFeed';
import DuvidaCard from '../../components/cards/DuvidaCard';
import RegraCard from '../../components/cards/RegraCard';
import AiCard from '../../components/cards/AiCard';

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
        return data?.pages.flatMap((page) => page.posts) || [];
    }, [data]);

    const isRecommendation = data?.pages[0]?.isRecommendation || false;

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 w-full flex flex-col items-center">
            {isRecommendation && !isLoading && (
                <div className="w-full flex flex-col items-center justify-center p-8 mb-8 text-center">
                    <div className="w-32 h-32 rounded-xl mb-4 flex items-center justify-center">
                        <span className="text-sub-text text-sm font-medium">Imagem</span>
                    </div>

                    <h2 className="text-2xl font-bold text-text mb-2">Seu feed está vazio!</h2>
                    <p className="text-sub-text mb-6">
                        Comece a seguir outros usuários para ver as publicações deles aqui no seu
                        feed.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4 w-full">
                {posts.map((post, index) => {
                    const isLast = posts.length === index + 1;
                    let CardComponent: any;

                    if (post.type === 'regra') {
                        CardComponent = RegraCard;
                    } else if (post.type === 'duvida') {
                        CardComponent = DuvidaCard;
                    } else if (post.type === 'ai') {
                        CardComponent = AiCard;
                    } else return null;

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

            {!isLoading && !hasNextPage && posts.length > 0 && !isRecommendation && (
                <div className="text-center text-sub-text py-10 text-sm">
                    Você chegou ao fim do feed.
                </div>
            )}
        </div>
    );
}
