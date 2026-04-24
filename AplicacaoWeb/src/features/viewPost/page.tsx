'use client';
import { useViewPost } from './hooks/useViewPost';
import DuvidaCard from '@/src/components/cards/DuvidaCard';
import RegraCard from '@/src/components/cards/RegraCard';
import CommentSection from './components/CommentSection';

export default function ViewPostFeature({ tipo, idPublico }: any) {
    const { post, loading, error } = useViewPost(tipo, idPublico);

    if (loading) {
        return <div className="p-8 text-muted-foreground">Carregando...</div>;
    }

    if (error || !post)
        return <div className="p-8 text-destructive text-start">Post não encontrado.</div>;

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
