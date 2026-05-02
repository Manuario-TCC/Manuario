'use client';

import Link from 'next/link';
import { formatTimeAgo } from '@/src/utils/formatTimeAgo';
import {
    MoreHorizontal,
    Heart,
    MessageCircle,
    Share2,
    Edit2,
    Flag,
    Trash2,
    ShieldAlert,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useLike } from '@/src/hooks/useLike';
import { useShare } from '@/src/hooks/useShare';
import { usePostActions } from '@/src/hooks/usePostActions';

import { RoleBadge } from '@/src/components/RoleBadge';
import { ReasonModal } from '@/src/components/ReasonModal';

interface FeedCardBaseProps {
    post: any;
    postUrl: string;
    children: ReactNode;
}

export default function FeedCardBase({ post, postUrl, children }: FeedCardBaseProps) {
    if (post.isDisabled) return null;

    const userIdUrl = post.user?.idPublic || post.user?.id;
    const userAvatarUrl = post.user?.img
        ? `/upload/${userIdUrl}/user/${post.user.img}`
        : '/img/iconePadrao.jpg';

    const { isLiked, likeCount, isLoadingLike, handleToggleLike } = useLike(
        post.hasLiked || false,
        post.likeCount || 0,
        post.type,
        post.idPublic,
    );

    const { sharePost } = useShare();

    const {
        isMenuOpen,
        setIsMenuOpen,
        menuRef,
        isOwner,
        isAdminOrSuperAdmin,
        isSubmitting,
        isReasonModalOpen,
        setIsReasonModalOpen,
        loadingSession,
        handleEdit,
        handleDelete,
        handleDisable,
        handleReport,
    } = usePostActions(post);

    return (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-4 hover:border-gray transition-colors w-full shadow-md max-w-[40rem]">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <Link href={`/perfil/${userIdUrl}`}>
                        <img
                            src={userAvatarUrl}
                            alt={post.user?.name}
                            className="w-10 h-10 rounded-full object-cover border border-card-border"
                        />
                    </Link>

                    <div className="flex items-center gap-1.5">
                        <Link
                            href={`/perfil/${userIdUrl}`}
                            className="text-text font-bold text-base"
                        >
                            {post.user?.name}
                        </Link>
                        <RoleBadge
                            isAdmin={post.user?.isAdmin}
                            isSuperAdmin={post.user?.isSuperAdmin}
                            size={16}
                        />
                        <span className="text-sub-text text-sm flex items-center gap-1 ml-0.5">
                            <span className="text-lg leading-none">•</span>{' '}
                            {formatTimeAgo(post.createdAt)}
                        </span>
                    </div>
                </div>

                {!loadingSession && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-sub-text hover:text-text cursor-pointer transition-colors p-1"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-background border border-card-border rounded-lg shadow-lg overflow-hidden z-50">
                                {isOwner && (
                                    <button
                                        onClick={handleEdit}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-card-border/30 transition-colors flex items-center gap-2 text-text cursor-pointer"
                                    >
                                        <Edit2 size={15} /> Editar
                                    </button>
                                )}

                                {(isOwner || isAdminOrSuperAdmin) && (
                                    <button
                                        onClick={() => {
                                            if (isOwner) {
                                                handleDelete();
                                            } else {
                                                setIsReasonModalOpen(true);
                                            }
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 cursor-pointer ${
                                            !isOwner && isAdminOrSuperAdmin
                                                ? 'text-red-500 hover:bg-red-500/10 border-t border-card-border'
                                                : 'text-red-500 hover:bg-card-border/30'
                                        }`}
                                    >
                                        {!isOwner && isAdminOrSuperAdmin ? (
                                            <ShieldAlert size={15} />
                                        ) : (
                                            <Trash2 size={15} />
                                        )}
                                        {!isOwner && isAdminOrSuperAdmin ? 'Desativar' : 'Excluir'}
                                    </button>
                                )}

                                {!isOwner && (
                                    <button
                                        onClick={handleReport}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-card-border/30 transition-colors flex items-center gap-2 text-text cursor-pointer border-t border-card-border"
                                    >
                                        <Flag size={15} /> Denunciar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {children}

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-card-border">
                <button
                    onClick={handleToggleLike}
                    disabled={isLoadingLike}
                    className={`flex items-center gap-1.5 cursor-pointer transition-all ${isLiked ? 'text-red-500' : 'text-sub-text hover:text-red-500'}`}
                >
                    <Heart
                        size="1.25rem"
                        fill={isLiked ? 'currentColor' : 'none'}
                        className="transition-all"
                    />
                    <span className="text-xs font-bold">{likeCount}</span>
                </button>

                <Link
                    href={postUrl}
                    className="flex items-center gap-1.5 text-sub-text hover:text-secondary transition-all"
                >
                    <MessageCircle size="1.25rem" />
                    <span className="text-xs font-bold">{post.commentCount || 0}</span>
                </Link>

                <button
                    onClick={() => sharePost(post.type, post.idPublic)}
                    className="flex items-center gap-1.5 text-sub-text hover:text-primary cursor-pointer transition-colors"
                >
                    <Share2 size="1.25rem" />
                </button>
            </div>

            <ReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => setIsReasonModalOpen(false)}
                onConfirm={handleDisable}
                title="Desativar Publicação"
                description="Por favor, informe o motivo detalhado para desativar esta publicação. Essa ação será registrada nos logs da plataforma."
                actionLabel={isSubmitting ? 'Desativando...' : 'Desativar Publicação'}
            />
        </div>
    );
}
