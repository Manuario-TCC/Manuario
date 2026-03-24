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
};
