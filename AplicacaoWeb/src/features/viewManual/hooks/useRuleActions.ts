import { useRouter } from 'next/navigation';
import { manualService } from '../services/manualService';

interface UseRuleActionsProps {
    manualId: string;
    isDonoDoManual: boolean;
    isAutorDaRegra: boolean;
}

export const useRuleActions = ({
    manualId,
    isDonoDoManual,
    isAutorDaRegra,
}: UseRuleActionsProps) => {
    const router = useRouter();

    const handleEdit = (regra: any) => {
        if (isAutorDaRegra) {
            router.push(`/create?tab=regra&id=${regra.idPublic}`);
        } else if (isDonoDoManual) {
            const queryParams = new URLSearchParams({
                tab: 'regra',
                overrideId: regra.id,
                manualId: manualId,
                nomePrefill: regra.name,
                descPrefill: regra.description,
            }).toString();

            router.push(`/create?${queryParams}`);
        }
    };

    const handleDelete = async (regraId: string) => {
        const confirmou = confirm('Tem certeza que deseja remover esta regra?');
        if (!confirmou) return;

        try {
            if (isAutorDaRegra) {
                await manualService.deleteRegra(regraId);
            } else if (isDonoDoManual) {
                await manualService.hideRule(manualId, regraId);
            }

            alert('Regra removida com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao remover a regra.');
        }
    };

    return { handleEdit, handleDelete };
};
