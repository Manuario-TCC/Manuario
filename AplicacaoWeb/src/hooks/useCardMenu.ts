import { useState, useRef, useEffect } from 'react';
import { useSession } from './useSession';
import { useRouter } from 'next/navigation';

export function useCardMenu(post: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { user: currentUser, loading } = useSession();

    let isOwner = false;

    if (!loading && currentUser) {
        const matchUserId = Boolean(currentUser.id && currentUser.id === post.userId);
        const matchIdPublic = Boolean(
            currentUser.idPublic && currentUser.idPublic === post.user?.idPublic,
        );
        const matchUserObjId = Boolean(currentUser.id && currentUser.id === post.user?.id);

        isOwner = matchUserId || matchIdPublic || matchUserObjId;
    }

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

        const tab = post.type === 'regra' ? 'regra' : 'duvida';

        router.push(`/create?tab=${tab}&id=${post.idPublic}`);
    };

    const handleReport = () => {
        setIsMenuOpen(false);
    };

    return {
        isMenuOpen,
        setIsMenuOpen,
        menuRef,
        isOwner,
        handleEdit,
        handleReport,
        loadingSession: loading,
    };
}
