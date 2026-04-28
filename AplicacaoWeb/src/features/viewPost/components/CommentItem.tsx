import Link from 'next/link';
import { MoreHorizontal, Heart, MessageCircle, Pencil, Trash2, Flag } from 'lucide-react';
import { formatTimeAgo } from '@/src/utils/formatTimeAgo';
import { useCommentItem } from '../hooks/useCommentItem';
import CommentInput from './CommentInput';

interface Props {
    comment: any;
    onAddReply: (text: string, parentId: string) => Promise<boolean>;
    onReplySuccess: () => void;
}

export default function CommentItem({ comment, onAddReply, onReplySuccess }: Props) {
    const {
        showReplyInput,
        showReplies,
        isMenuOpen,
        isAuthor,
        isEditing,
        editValue,
        isSubmitting,
        setEditValue,
        setIsEditing,
        toggleReplyInput,
        toggleReplies,
        toggleMenu,
        handleReplySuccess,
        startEditing,
        handleUpdate,
        handleDelete,
    } = useCommentItem(comment, onReplySuccess);

    const userAvatarUrl = comment.author?.img
        ? `/upload/${comment.author.idPublic}/user/${comment.author.img}`
        : '/img/iconePadrao.jpg';

    return (
        <div className="flex gap-3 mt-6">
            <Link href={`/perfil/${comment.author?.idPublic}`}>
                <img
                    src={userAvatarUrl}
                    alt={comment.author?.name}
                    className="w-[1.8rem] h-[1.8rem] rounded-full object-cover border border-card-border shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                />
            </Link>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <Link href={`/perfil/${comment.author?.idPublic}`}>
                            <span className="text-text font-bold text-sm cursor-pointer">
                                {comment.author?.name}
                            </span>
                        </Link>

                        <span className="text-sub-text text-xs flex items-center gap-1">
                            <span className="text-lg leading-none">•</span>{' '}
                            {formatTimeAgo(comment.createdAt)}
                            {comment.createdAt !== comment.updatedAt && (
                                <span className="text-[10px] ml-1">(editado)</span>
                            )}
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="text-sub-text hover:text-text cursor-pointer transition-colors p-1"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-7 w-36 bg-card border border-card-border rounded-md shadow-lg z-10 flex flex-col overflow-hidden">
                                {isAuthor ? (
                                    <>
                                        <button
                                            onClick={startEditing}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray transition-colors w-full text-left cursor-pointer"
                                        >
                                            <Pencil size={14} /> Editar
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
                                        >
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </>
                                ) : (
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray transition-colors w-full text-left cursor-pointer">
                                        <Flag size={14} /> Reportar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-2">
                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full bg-transparent text-text p-3 border border-border rounded-md focus:outline-none focus:border-primary text-sm min-h-[80px] resize-y"
                                disabled={isSubmitting}
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end mt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSubmitting}
                                    className="px-4 py-1.5 text-xs font-bold text-sub-text hover:text-text transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={
                                        isSubmitting ||
                                        !editValue.trim() ||
                                        editValue === comment.text
                                    }
                                    className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                                >
                                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-text text-sm whitespace-pre-wrap leading-relaxed">
                            {comment.text}
                        </p>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-4 text-xs text-sub-text font-bold">
                        <button className="flex items-center gap-1.5 hover:text-red-500 transition-all cursor-pointer">
                            <Heart size={16} /> 2
                        </button>
                        <button
                            onClick={toggleReplyInput}
                            className="flex items-center gap-1.5 hover:text-secondary transition-all cursor-pointer"
                        >
                            <MessageCircle size={16} /> Responder
                        </button>
                        {comment.replies?.length > 0 && (
                            <button
                                onClick={toggleReplies}
                                className="hover:text-secondary transition-all cursor-pointer"
                            >
                                {showReplies
                                    ? 'Ocultar respostas'
                                    : `Ver ${comment.replies.length} respostas`}
                            </button>
                        )}
                    </div>
                )}

                {showReplyInput && (
                    <div className="mt-4">
                        <CommentInput
                            onSubmit={(t: string) => onAddReply(t, comment.id)}
                            onSuccess={() => {
                                handleReplySuccess();
                                onReplySuccess();
                            }}
                        />
                    </div>
                )}

                {showReplies && comment.replies?.length > 0 && (
                    <div className="mt-4 border-l border-card-border pl-4">
                        {comment.replies.map((res: any) => (
                            <CommentItem
                                key={res.id}
                                comment={res}
                                onAddReply={onAddReply}
                                onReplySuccess={onReplySuccess}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
