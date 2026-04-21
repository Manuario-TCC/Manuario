export interface AuthPayload {
    action: 'login' | 'register';
    name?: string;
    email: string;
    password: string;
}

export const authService = {
    async authenticate(data: AuthPayload) {
        const endpoint = data.action === 'login' ? '/api/auth/login' : '/api/auth/signup';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Falha na autenticação');
        }

        return result;
    },

    logout: async () => {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Falha ao comunicar com o servidor para logout');
        }

        return response.json();
    },
};

export async function getMe() {
    const response = await fetch(`/api/auth/me?t=${Date.now()}`, {
        cache: 'no-store',
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Não autenticado');
    }

    return response.json();
}
