import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileEditService } from '../services/profileEditService';
import { customAlert } from '@/src/components/customAlert';

export interface ProfileLink {
    name: string;
    url: string;
}

export const useProfileEdit = (
    initialName: string,
    initialEmail: string,
    initialBio?: string,
    initialLinks?: ProfileLink[],
) => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: initialName || '',
        email: initialEmail || '',
        password: '',
        bio: initialBio || '',
        links: initialLinks || [],
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            name: initialName || '',
            email: initialEmail || '',
            bio: initialBio || '',
            links: initialLinks || [],
        }));
    }, [initialName, initialEmail, initialBio, initialLinks]);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData((prev) => ({ ...prev, password: '' }));
    };

    const addLink = () => {
        setFormData((prev) => ({
            ...prev,
            links: [...prev.links, { name: '', url: '' }],
        }));
    };

    const updateLink = (index: number, field: 'name' | 'url', value: string) => {
        setFormData((prev) => {
            const newLinks = [...prev.links];
            newLinks[index] = { ...newLinks[index], [field]: value };
            return { ...prev, links: newLinks };
        });
    };

    const removeLink = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index),
        }));
    };

    const mutation = useMutation({
        mutationFn: async () => {
            const payload = { ...formData };

            if (!payload.password || payload.password.trim() === '') {
                delete payload.password;
            }

            if (!payload.email || payload.email.trim() === '') {
                delete payload.email;
            }

            await profileEditService.updateProfile(payload);

            if (avatarFile) {
                await profileEditService.updateAvatar(avatarFile);
            }

            if (bannerFile) {
                await profileEditService.updateBanner(bannerFile);
            }
        },
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['user-me'] });
            customAlert.toastSuccess('Perfil atualizado com sucesso!');
        },
        onError: (error: any) => {
            console.error('Erro ao salvar edições do perfil:', error.message);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBannerFile(e.target.files[0]);
        }
    };

    const handleSave = () => {
        mutation.mutate();
    };

    const handleLogout = async () => {
        try {
            await profileEditService.logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
            try {
                await profileEditService.deleteAccount();
                window.location.href = '/signup';
            } catch (error) {
                console.error('Erro ao deletar conta:', error);
            }
        }
    };

    return {
        isModalOpen,
        formData,
        isLoading: mutation.isPending,
        avatarFile,
        bannerFile,
        openModal,
        closeModal,
        handleChange,
        addLink,
        updateLink,
        removeLink,
        handleAvatarChange,
        handleBannerChange,
        handleSave,
        handleLogout,
        handleDeleteAccount,
    };
};
