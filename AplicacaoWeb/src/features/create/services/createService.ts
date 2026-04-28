export async function createManualService(formData: FormData) {
    return fetch('/api/manual', {
        method: 'POST',
        body: formData,
    });
}

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

export async function fetchUserManuals() {
    return fetch('/api/manual/me');
}

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

export async function getRuleById(id: string) {
    return fetch(`/api/rules/${id}`);
}

export async function getManualById(id: string) {
    return fetch(`/api/manual/${id}`);
}

export async function updateDoubtService(id: string, payload: any) {
    return fetch(`/api/question/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export async function updateRuleService(id: string, payload: any) {
    return fetch(`/api/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export async function updateManualService(id: string, formData: FormData) {
    return fetch(`/api/manual/${id}`, {
        method: 'PUT',
        body: formData,
    });
}

export const searchUsersService = async (email: string) => {
    const response = await fetch(`/api/users/search?email=${email}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
    }
    return response.json();
};
