import { useState, useMemo, useCallback } from 'react';
import { useSession } from '@/src/hooks/useSession';
import { commentService } from '../services/commentService';
import { customAlert } from '@/src/components/customAlert';
import { useCommentLike } from './useCommentLike';

export const useCommentItem = (comment: any, onSuccess: () => void) => {
    const { user: currentUser } = useSession();

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(comment.text);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialIsLiked = useMemo(() => {
        return comment?.isLiked || false;
    }, [comment]);

    const { isLiked, likeCount, handleToggleLike, isLoadingLike } = useCommentLike(
        initialIsLiked,
        comment.likeCount || 0,
        comment.id,
    );

    const isEdited = comment.isEdited || false;

    const toggleReplyInput = useCallback(() => setShowReplyInput((prev) => !prev), []);
    const toggleReplies = useCallback(() => setShowReplies((prev) => !prev), []);
    const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    const handleReplySuccess = useCallback(() => {
        setShowReplyInput(false);
        setShowReplies(true);
    }, []);

    const isAuthor = useMemo(() => {
        if (!currentUser || !comment) return false;
        return (
            currentUser.idPublic === comment.author?.idPublic || currentUser.id === comment.authorId
        );
    }, [currentUser, comment]);

    const startEditing = () => {
        setIsEditing(true);
        setEditValue(comment.text);
        setIsMenuOpen(false);
    };

    const handleUpdate = async () => {
        if (!editValue.trim() || editValue === comment.text) {
            setIsEditing(false);
            return;
        }
        try {
            setIsSubmitting(true);
            await commentService.updateComment(comment.id, editValue);

            comment.text = editValue;
            comment.updatedAt = new Date().toISOString();
            comment.isEdited = true;

            setIsEditing(false);
            onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const result = await customAlert.confirmDelete(
            'Excluir Comentário',
            'Tem certeza que deseja excluir? Esta ação é permanente.',
        );

        if (result.isConfirmed) {
            try {
                setIsSubmitting(true);
                await commentService.deleteComment(comment.id);
                onSuccess();
                customAlert.toastSuccess('Excluído com sucesso');
            } catch (error) {
                console.error(error);
                customAlert.toastError('Erro ao excluir comentário');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return {
        showReplyInput,
        showReplies,
        isMenuOpen,
        isAuthor,
        isEditing,
        editValue,
        isSubmitting,
        isLiked,
        likeCount,
        isLoadingLike,
        setEditValue,
        setIsEditing,
        toggleReplyInput,
        toggleReplies,
        toggleMenu,
        closeMenu,
        handleReplySuccess,
        startEditing,
        handleUpdate,
        handleDelete,
        handleToggleLike,
        isEdited,
    };
};
