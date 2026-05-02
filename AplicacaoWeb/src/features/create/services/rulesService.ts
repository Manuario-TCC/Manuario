export interface CreateRulePayload {
    publicationId: string;
    name: string;
    description: string;
    manualId: string;
    isHouseRule: boolean;
    userId: string;
    status: 'PUBLICADO' | 'PRIVADO';
}

export async function createRuleService(payload: CreateRulePayload) {
    return fetch('/api/rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

export async function getRuleById(id: string) {
    return fetch(`/api/rules/${id}`);
}

export async function updateRuleService(id: string, payload: any) {
    return fetch(`/api/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export const deleteRuleService = async (editId: string) => {
    const response = await fetch(`/api/rules/${editId}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Erro ao excluir regra');
    }
    return response.json();
};

export async function uploadRuleImageService(formData: FormData) {
    const res = await fetch('/api/upload/md', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        throw new Error('Erro no upload da imagem');
    }
    return res.json();
}
