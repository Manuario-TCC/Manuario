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
    return fetch('/api/regra', {
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
    return fetch('/api/duvida', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}
