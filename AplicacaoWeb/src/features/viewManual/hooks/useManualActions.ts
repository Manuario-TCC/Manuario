import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { manualService } from '../services/manualService';
import { customAlert } from '@/src/components/customAlert';

export const useManualActions = () => {
    const router = useRouter();
    const [isForking, setIsForking] = useState(false);

    const handleFork = async (manualId: string) => {
        try {
            setIsForking(true);
            const data = await manualService.forkManual(manualId);

            router.push(`/manual/${data.manualId}`);
        } catch (error) {
            console.error('Falha ao clonar:', error);
            alert('Não foi possível clonar o manual.');
        } finally {
            setIsForking(false);
        }
    };

    return { handleFork, isForking };
};
