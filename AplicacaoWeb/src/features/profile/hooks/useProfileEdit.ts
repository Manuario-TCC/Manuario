import { useState } from 'react';
import { profileEditService } from '../services/profileEditService';

export const useProfileEdit = (initialName: string) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: initialName,
        email: '',
        password: '',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await profileEditService.updateProfile(formData);

            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await profileEditService.logout();
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
            try {
                await profileEditService.deleteAccount();
                window.location.href = '/signup';
            } catch (error) {
                console.error(error);
            }
        }
    };

    return {
        isModalOpen,
        formData,
        isLoading,
        openModal,
        closeModal,
        handleChange,
        handleSave,
        handleLogout,
        handleDeleteAccount,
    };
};
