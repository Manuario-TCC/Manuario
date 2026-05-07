import { useState } from 'react';
import { adminService } from '../services/adminService';
import { customAlert } from '@/src/components/customAlert';

export function useAdminActions() {
    const [isActionLoading, setIsActionLoading] = useState(false);

    const handleToggleAdmin = async (
        userId: string,
        currentAdminStatus: boolean,
        onSuccess: (newStatus: boolean) => void,
    ) => {
        setIsActionLoading(true);
        try {
            const data = await adminService.toggleAdmin(userId);
            onSuccess(data.isAdmin);

            customAlert.toastSuccess(
                data.isAdmin ? 'Usuário agora é um ADM.' : 'Cargo de ADM removido.',
            );
        } catch (error: any) {
            customAlert.toastError('Ops...');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDisableUser = async (userId: string, reason: string, onSuccess: () => void) => {
        setIsActionLoading(true);
        try {
            await adminService.disableUser(userId, reason);
            onSuccess();

            customAlert.toastSuccess('Usuário Desabilitado.');
        } catch (error: any) {
            customAlert.toastError('Ops...');
        } finally {
            setIsActionLoading(false);
        }
    };

    return {
        isActionLoading,
        handleToggleAdmin,
        handleDisableUser,
    };
}
