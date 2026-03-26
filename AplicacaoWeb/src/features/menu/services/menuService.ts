export async function getMe() {
    const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar dados do usuário');
    }

    return response.json();
}
