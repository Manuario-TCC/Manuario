import { useState, useMemo, useCallback } from 'react';
import { useSession } from '@/src/hooks/useSession';
import { commentService } from '../services/commentService';

export const useCommentItem = (comment: any, onSuccess: () => void) => {
    const { user: currentUser } = useSession();

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(comment.texto);
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
        if (currentUser.idPublico && comment.autor?.idPublico) {
            if (currentUser.idPublico === comment.autor.idPublico) return true;
        }

        const currentId = String(currentUser.id || '');
        const authorId = String(comment.autorId || comment.autor?.id || '');

        return currentId === authorId && currentId !== '';
    }, [currentUser, comment]);

    const startEditing = () => {
        setIsEditing(true);
        setEditValue(comment.texto);
        setIsMenuOpen(false);
    };

    const handleUpdate = async () => {
        if (!editValue.trim() || editValue === comment.texto) {
            setIsEditing(false);
            return;
        }
        try {
            setIsSubmitting(true);
            await commentService.updateComment(comment.id, editValue);
            setIsEditing(false);
            onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
        try {
            await commentService.deleteComment(comment.id);
            onSuccess();
        } catch (error) {
            console.error(error);
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
