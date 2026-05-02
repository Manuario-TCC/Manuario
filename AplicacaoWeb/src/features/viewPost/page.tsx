'use client';

import { useState, useEffect } from 'react';
import { useViewPost } from './hooks/useViewPost';
import DuvidaCard from '@/src/components/cards/DuvidaCard';
import RegraCard from '@/src/components/cards/RegraCard';
import CommentSection from './components/CommentSection';
import { PostSidebar } from './components/PostSidebar';
import { notFound } from 'next/navigation';

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
        <div className="h-32 w-full rounded bg-card-border/50" />
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
        return (
            <div className="flex flex-col items-start w-full py-8 px-4">
                <div className="w-full max-w-5xl">
                    <PostSkeleton />
                </div>
            </div>
        );
    }

    if (error || (!post && !loading)) {
        notFound();
    }

    const gameName = post?.game || post?.manuals?.[0]?.game;

    return (
        <div className="w-full py-8 px-4 lg:px-12 flex justify-center">
            <div className="flex flex-col lg:flex-row gap-12 w-full max-w-7xl items-start justify-center">
                <div className="flex-1 flex flex-col items-start w-full min-w-0 lg:ml-4">
                    <div className="w-full max-w-5xl">
                        {tipo === 'questions' && <DuvidaCard post={post} isFullView={true} />}
                        {tipo === 'rules' && <RegraCard post={post} isFullView={true} />}
                    </div>

                    <div className="w-full max-w-3xl mt-10">
                        {' '}
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
