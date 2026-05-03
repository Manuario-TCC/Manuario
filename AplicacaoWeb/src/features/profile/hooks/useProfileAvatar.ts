import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { profileService } from '../services/profileService';

import { socket } from '@/src/services/socket';

export const useProfileAvatar = (initialAvatarUrl: string, isOwnProfile: boolean) => {
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
    const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
    const [tempAvatarImage, setTempAvatarImage] = useState<string>('');
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        if (isOwnProfile) avatarInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setTempAvatarImage(imageUrl);
            setIsAvatarEditorOpen(true);
        }

        if (e.target) {
            e.target.value = '';
        }
    };

    const handleSaveEditedAvatar = async (file: File) => {
        const newUrl = URL.createObjectURL(file);
        setAvatarUrl(newUrl);
        setIsAvatarEditorOpen(false);

        await profileService.updateAvatar(file);

        Swal.fire({
            title: 'Avatar atualizado!',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            background: '#18181b',
            color: '#fff',
        });

        socket.emit('profile_updated', { type: 'avatar' });
    };

    return {
        avatarUrl,
        isAvatarEditorOpen,
        tempAvatarImage,
        setIsAvatarEditorOpen,
        avatarInputRef,
        handleAvatarClick,
        handleAvatarChange,
        handleSaveEditedAvatar,
    };
};
