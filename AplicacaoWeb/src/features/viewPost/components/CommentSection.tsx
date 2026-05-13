import { useComments } from '../hooks/useComments';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

const CommentItemSkeleton = () => (
    <div className="flex gap-3 py-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-card-border/20 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-card-border/20 rounded w-1/4" />
            <div className="h-3 bg-card-border/10 rounded w-full" />
            <div className="h-3 bg-card-border/10 rounded w-5/6" />
        </div>
    </div>
);

export default function CommentSection({ postId, postType }: any) {
    const { comments, loading, addComment, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useComments(postId, postType);

    return (
        <div className="bg-card rounded-xl p-6 w-full shadow-sm border border-card-border/40">
            <div className="flex flex-col">
                <CommentInput onSubmit={(t: string) => addComment(t, null)} />

                <div className="flex flex-col gap-2 mt-4">
                    {loading ? (
                        <div className="divide-y divide-card-border/10">
                            <CommentItemSkeleton />
                            <CommentItemSkeleton />
                        </div>
                    ) : (
                        <>
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    postId={postId}
                                    onAddReply={(t, p, rC, rU) => addComment(t, p, rC, rU)}
                                    onReplySuccess={() => {}}
                                />
                            ))}

                            {hasNextPage && (
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="mt-4 py-2 text-sm font-bold text-primary hover:underline disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    {isFetchingNextPage
                                        ? 'Carregando mais...'
                                        : 'Carregar mais comentários'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
