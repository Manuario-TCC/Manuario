'use client';

import { useViewPost } from './hooks/useViewPost';
import DuvidaCard from '@/src/components/cards/DuvidaCard';
import RegraCard from '@/src/components/cards/RegraCard';
import CommentSection from './components/CommentSection';
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

export default function ViewPostFeature({ tipo, idPublico }: { tipo: string; idPublico: string }) {
    const { post, loading, error } = useViewPost(tipo, idPublico);

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

    return (
        <div className="flex flex-col items-start w-full py-8 px-4">
            <div className="w-full max-w-5xl">
                {tipo === 'duvida' && <DuvidaCard post={post} isFullView={true} />}
                {tipo === 'regra' && <RegraCard post={post} isFullView={true} />}
            </div>

            <div className="w-full max-w-3xl">
                <CommentSection postId={post.id} postType={tipo} />
            </div>
        </div>
    );
}
