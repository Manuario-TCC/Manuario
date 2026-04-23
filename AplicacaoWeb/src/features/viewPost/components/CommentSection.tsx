import { useComments } from '../hooks/useComments';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

export default function CommentSection({ postId, postType }: any) {
    const { comentarios, loading, addComment, fetchComments } = useComments(postId, postType);

    return (
        <div className="bg-card rounded-xl p-6 w-full max-w-[40rem] shadow-sm">
            <div className="flex flex-col">
                <CommentInput onSubmit={(t: string) => addComment(t, null)} />

                <div className="flex flex-col gap-2 mt-2">
                    {loading ? (
                        <p className="text-muted-foreground text-xs text-center py-4">
                            Carregando...
                        </p>
                    ) : comentarios.length > 0 ? (
                        comentarios.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onAddReply={(t: string, p: string) => addComment(t, p)}
                                onReplySuccess={fetchComments}
                            />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-6">
                            Nenhum comentário ainda. Seja o primeiro a comentar!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
