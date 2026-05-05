import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { manualService } from '../services/manualService';
import { customAlert } from '@/src/components/customAlert';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/src/services/socket';

export const useManualActions = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isForking, setIsForking] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

    const handleFork = async (manualId: string) => {
        try {
            setIsForking(true);
            const data = await manualService.forkManual(manualId);
            router.push(`/manual/${data.manualId}`);
        } catch (error) {
            console.error('Falha ao clonar:', error);
            customAlert.error('Erro', 'Não foi possível clonar o manual.');
        } finally {
            setIsForking(false);
        }
    };

    const handleDisableManual = async (manualIdPublic: string, reason: string) => {
        try {
            setIsDisabling(true);
            const responseData = await manualService.disableManual(manualIdPublic, reason);

            setIsReasonModalOpen(false);
            customAlert.toastSuccess('Manual desativado com sucesso');

            queryClient.invalidateQueries({ queryKey: ['feed'] });
            queryClient.invalidateQueries({ queryKey: ['user-manuals'] });

            if (responseData && responseData.notification) {
                socket.emit('send_notification', responseData.notification);
            }

            router.push('/feed');
        } catch (error: any) {
            console.error(error);
            customAlert.toastError(error.message || 'Erro ao desativar manual');
        } finally {
            setIsDisabling(false);
        }
    };

    return {
        handleFork,
        isForking,
        handleDisableManual,
        isDisabling,
        isReasonModalOpen,
        setIsReasonModalOpen,
    };
};
