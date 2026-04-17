export async function getMe() {
    const response = await fetch(`/api/auth/me?t=${Date.now()}`, {
        cache: 'no-store',
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Falha ao buscar dados do usuário');
    }

    return response.json();
}
