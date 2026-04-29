export interface CreateDoubtPayload {
    publicationId: string;
    title: string;
    game: string;
    description: string;
    userId: string;
}

export async function createDoubtService(payload: CreateDoubtPayload) {
    return fetch('/api/question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

export async function getDoubtById(id: string) {
    return fetch(`/api/question/${id}`);
}

export async function updateDoubtService(id: string, payload: any) {
    return fetch(`/api/question/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export const deleteQuestionService = async (editId: string) => {
    const response = await fetch(`/api/question/${editId}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Erro ao excluir dúvida');
    }
    return response.json();
};
