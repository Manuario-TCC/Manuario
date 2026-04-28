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

    const handleDelete = async (ruleId: string) => {
        const confirmou = confirm('Tem certeza que deseja remover esta regra?');
        if (!confirmou) return;

        try {
            if (isAutorDaRegra) {
                await manualService.deleteRegra(ruleId);
            } else if (isDonoDoManual) {
                await manualService.hideRule(manualId, ruleId);
            }

            alert('Regra removida com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao remover a regra.');
        }
    };

    return { handleEdit, handleDelete };
};
