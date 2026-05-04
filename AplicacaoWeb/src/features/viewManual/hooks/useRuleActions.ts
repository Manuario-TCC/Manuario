import { useRouter } from 'next/navigation';
import { manualService } from '../services/manualService';
import { customAlert } from '@/src/components/customAlert';

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

    const handleEdit = (rules: any) => {
        if (isAutorDaRegra) {
            router.push(`/create?tab=regra&id=${rules.idPublic}`);
        } else if (isDonoDoManual) {
            const queryParams = new URLSearchParams({
                tab: 'regra',
                overrideId: rules.id,
                manualId: manualId,
                nomePrefill: rules.name,
                descPrefill: rules.description,
            }).toString();

            router.push(`/create?${queryParams}`);
        }
    };

    const handleDelete = async (rule: any) => {
        const confirmou = await customAlert.confirmDelete(
            'Tem certeza que deseja remover esta regra?',
        );
        if (!confirmou.isConfirmed) return;

        try {
            if (isAutorDaRegra) {
                await manualService.deleteRegra(rule.idPublic);
            } else if (isDonoDoManual) {
                await manualService.hideRule(manualId, rule.id);
            }

            await customAlert.toastSuccess('Regra removida com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
            customAlert.error('Erro', 'Erro ao remover a regra.');
        }
    };

    return { handleEdit, handleDelete };
};
