// aplicacao_web/src/features/viewPost/hooks/useCommentItem.ts
import { useState, useMemo, useCallback } from 'react';
import { useSession } from '@/src/hooks/useSession';
import { commentService } from '../services/commentService';
import { customAlert } from '@/src/components/customAlert'; // Importando o seu componente

export const useCommentItem = (comment: any, onSuccess: () => void) => {
    const { user: currentUser } = useSession();

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(comment.text);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (currentUser.idPublic && comment.author?.idPublic) {
            if (currentUser.idPublic === comment.author.idPublic) return true;
        }

        const currentId = String(currentUser.id || '');
        const authorId = String(comment.authorId || comment.author?.id || '');

        return currentId === authorId && currentId !== '';
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
    };
};
