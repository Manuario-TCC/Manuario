export const manualService = {
    getManualById: async (id: string) => {
        const response = await fetch(`/api/manual/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o manual');
        }
        return response.json();
    },

    getRegrasByManualId: async (id: string, page: number, search: string) => {
        const response = await fetch(
            `/api/manual/${id}/rules?page=${page}&limit=10&search=${search}`,
        );
        if (!response.ok) {
            throw new Error('Erro ao buscar as regras');
        }
        return response.json();
    },

    forkManual: async (manualId: string) => {
        const res = await fetch(`/api/manual/${manualId}/fork`, {
            method: 'POST',
        });

        if (!res.ok) {
            throw new Error('Erro ao clonar manual');
        }

        return res.json();
    },

    hideRule: async (manualId: string, ruleId: string) => {
        const res = await fetch(`/api/manual/${manualId}/hide-rule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ruleId }),
        });

        if (!res.ok) {
            throw new Error('Erro ao ocultar regra');
        }

        return res.json();
    },

    deleteRegra: async (ruleId: string) => {
        const res = await fetch(`/api/rules/${ruleId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Erro ao excluir regra');
        }

        return res.json();
    },

    disableManual: async (idPublic: string, reason: string) => {
        const response = await fetch(`/api/manual/${idPublic}/disable`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Erro ao desativar manual');
        }
        return response.json();
    },

    exportManualPDF: async (manualIdPublic: string) => {
        const response = await fetch(`/api/manual/${manualIdPublic}/export`);

        if (!response.ok) {
            throw new Error('Falha na exportação');
        }

        return response.json();
    },
};
