'use client';

import { useState, useEffect } from 'react';
import { useViewPost } from './hooks/useViewPost';
import DuvidaCard from '@/src/components/cards/DuvidaCard';
import RegraCard from '@/src/components/cards/RegraCard';
import AiCard from '@/src/components/cards/AiCard';
import CommentSection from './components/CommentSection';
import { PostSidebar } from './components/PostSidebar';
import { notFound } from 'next/navigation';

const PostCardSkeleton = () => (
    <div className="w-full max-w-4xl bg-card rounded-xl p-6 border border-card-border/40 space-y-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-card-border/20" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-card-border/20 rounded w-1/3" />
                <div className="h-3 bg-card-border/10 rounded w-1/4" />
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-4 bg-card-border/20 rounded w-full" />
            <div className="h-4 bg-card-border/20 rounded w-full" />
            <div className="h-4 bg-card-border/10 rounded w-2/3" />
        </div>
        <div className="h-64 w-full bg-card-border/10 rounded-xl" />
    </div>
);

const SidebarSkeleton = () => (
    <div className="hidden lg:block w-full lg:w-[17rem] xl:w-[21rem] sticky top-8 animate-pulse shrink-0">
        <div className="bg-card border border-card-border/20 rounded-2xl p-5">
            <div className="h-6 bg-card-border/20 rounded w-1/2 mb-6" />

            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-16 h-16 bg-card-border/10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-card-border/20 rounded w-full" />
                            <div className="h-3 bg-card-border/10 rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PostSkeleton = () => (
    <div className="w-full py-8 px-4 md:px-6 xl:px-12 flex justify-center animate-pulse">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 xl:gap-12 items-start lg:justify-between">
            <div className="w-full lg:flex-1 max-w-[50rem] flex flex-col min-w-0 mx-auto lg:mx-0">
                <PostCardSkeleton />

                <div className="w-full mt-10 bg-card/40 rounded-xl p-6 border border-card-border/20">
                    <div className="h-10 bg-card-border/10 rounded-md w-full mb-6" />
                    <div className="space-y-4">
                        <div className="h-12 bg-card-border/5 rounded w-full" />
                        <div className="h-12 bg-card-border/5 rounded w-full" />
                    </div>
                </div>
            </div>

            <SidebarSkeleton />
        </div>
    </div>
);

export default function ViewPostFeature({ tipo, idPublic }: { tipo: string; idPublic: string }) {
    const { post, loading, error } = useViewPost(tipo, idPublic);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setShowSidebar(window.innerWidth >= 1024);
        };

        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    if (loading) {
        return <PostSkeleton />;
    }

    if (error || (!post && !loading)) {
        notFound();
    }

    const gameName = post?.game || post?.gameName || post?.manuals?.[0]?.game;

    return (
        <div className="w-full py-8 px-4 md:px-6 xl:px-12 flex justify-center">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 xl:gap-12 items-start lg:justify-between">
                <div className="w-full lg:flex-1 flex flex-col min-w-0 lg:mx-0 max-w-[50rem]">
                    <div className="w-full">
                        {tipo === 'questions' && <DuvidaCard post={post} isFullView={true} />}
                        {tipo === 'rules' && <RegraCard post={post} isFullView={true} />}
                        {tipo === 'ai' && <AiCard post={post} isFullView={true} />}
                    </div>

                    <div className="w-full mt-10">
                        <CommentSection postId={post.id} postType={tipo} />
                    </div>
                </div>

                {showSidebar && gameName && (
                    <PostSidebar type={tipo} gameName={gameName} currentIdPublic={idPublic} />
                )}
            </div>
        </div>
    );
}
