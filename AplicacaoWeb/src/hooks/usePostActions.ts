import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';
import { postService } from '@/src/services/postService';

export function usePostActions(post: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { user: currentUser, loading } = useSession();

    const isOwner = useMemo(() => {
        if (loading || !currentUser) return false;

        const matchUserId = Boolean(currentUser.id && currentUser.id === post.userId);
        const matchIdPublic = Boolean(
            currentUser.idPublic && currentUser.idPublic === post.user?.idPublic,
        );
        const matchUserObjId = Boolean(currentUser.id && currentUser.id === post.user?.id);

        return matchUserId || matchIdPublic || matchUserObjId;
    }, [currentUser, loading, post]);

    const isAdminOrSuperAdmin = useMemo(() => {
        if (loading || !currentUser) return false;
        return currentUser.isAdmin || currentUser.isSuperAdmin;
    }, [currentUser, loading]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = () => {
        setIsMenuOpen(false);
        const tab = post.type === 'regra' || post.type === 'rules' ? 'regra' : 'duvida';

        router.push(`/create?tab=${tab}&id=${post.idPublic}`);
    };

    const handleReport = () => {
        setIsMenuOpen(false);
        customAlert.toastSuccess('Denúncia enviada para análise.');
    };

    const handleDelete = async () => {
        const result = await customAlert.confirmDelete(
            'Excluir Publicação',
            'Tem certeza que deseja excluir esta publicação? Esta ação é permanente.',
        );

        if (result.isConfirmed) {
            try {
                setIsSubmitting(true);
                await postService.deletePost(post.type, post.idPublic);

                customAlert.toastSuccess('Publicação excluída com sucesso');
                router.refresh();
            } catch (error) {
                console.error(error);
                customAlert.toastError('Erro ao excluir publicação');
            } finally {
                setIsSubmitting(false);
                setIsMenuOpen(false);
            }
        }
    };

    const handleDisable = async (reason: string) => {
        try {
            setIsSubmitting(true);
            await postService.disablePost(post.type, post.idPublic, reason);

            post.isDisabled = true;
            setIsReasonModalOpen(false);
            customAlert.toastSuccess('Publicação desativada com sucesso');

            router.refresh();
        } catch (error) {
            console.error(error);
            customAlert.toastError('Erro ao desativar publicação');
        } finally {
            setIsSubmitting(false);
            setIsMenuOpen(false);
        }
    };

    return {
        isMenuOpen,
        setIsMenuOpen,
        menuRef,
        isOwner,
        isAdminOrSuperAdmin,
        isSubmitting,
        isReasonModalOpen,
        setIsReasonModalOpen,
        loadingSession: loading,
        handleEdit,
        handleReport,
        handleDelete,
        handleDisable,
    };
}
