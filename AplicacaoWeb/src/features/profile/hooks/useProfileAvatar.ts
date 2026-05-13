import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { customAlert } from '@/src/components/customAlert';

export const useProfileAvatar = (initialAvatarUrl: string, isOwnProfile: boolean) => {
    const queryClient = useQueryClient();
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

        customAlert.toastSuccess('Salvo com sucesso');

        queryClient.invalidateQueries({ queryKey: ['user-me'] });
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
