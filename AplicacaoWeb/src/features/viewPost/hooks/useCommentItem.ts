import { useState, useMemo, useCallback } from 'react';
import { useSession } from '@/src/hooks/useSession';
import { commentService } from '../services/commentService';
import { customAlert } from '@/src/components/customAlert';
import { useCommentLike } from './useCommentLike';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCommentItem = (comment: any, onSuccess: () => void) => {
    const { user: currentUser } = useSession();
    const queryClient = useQueryClient();

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(comment.text);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

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

    const isAdminOrSuperAdmin = useMemo(() => {
        if (!currentUser) return false;
        return currentUser.isAdmin || currentUser.isSuperAdmin;
    }, [currentUser]);

    const startEditing = () => {
        setIsEditing(true);
        setEditValue(comment.text);
        setIsMenuOpen(false);
    };

    const updateMutation = useMutation({
        mutationFn: (newText: string) => commentService.updateComment(comment.id, newText),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            setIsEditing(false);
            onSuccess();
        },

        onError: () => {
            customAlert.toastError('Erro ao atualizar comentário');
        },
    });

    const handleUpdate = () => {
        if (!editValue.trim() || editValue === comment.text) {
            setIsEditing(false);
            return;
        }

        updateMutation.mutate(editValue);
    };

    const deleteMutation = useMutation({
        mutationFn: () => commentService.deleteComment(comment.id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            onSuccess();
            customAlert.toastSuccess('Excluído com sucesso');
        },

        onError: () => {
            customAlert.toastError('Erro ao excluir comentário');
        },
    });

    const handleDelete = async () => {
        const result = await customAlert.confirmDelete(
            'Excluir Comentário',
            'Tem certeza que deseja excluir? Esta ação é permanente.',
        );

        if (result.isConfirmed) {
            deleteMutation.mutate();
        }
    };

    const disableMutation = useMutation({
        mutationFn: (reason: string) => commentService.disableComment(comment.id, reason),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            setIsReasonModalOpen(false);
            onSuccess();
            customAlert.toastSuccess('Comentário desativado com sucesso');
        },

        onError: () => {
            customAlert.toastError('Erro ao desativar comentário');
        },
    });

    const handleDisable = (reason: string) => {
        disableMutation.mutate(reason);
    };

    const isSubmitting =
        updateMutation.isPending || deleteMutation.isPending || disableMutation.isPending;

    return {
        showReplyInput,
        showReplies,
        isMenuOpen,
        isAuthor,
        isAdminOrSuperAdmin,
        isEditing,
        editValue,
        isSubmitting,
        isLiked,
        likeCount,
        isLoadingLike,
        isReasonModalOpen,
        setIsReasonModalOpen,
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
        handleDisable,
        handleToggleLike,
        isEdited,
    };
};
