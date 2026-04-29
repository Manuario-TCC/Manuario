export const searchUsersService = async (email: string) => {
    const response = await fetch(`/api/users/search?email=${email}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
    }
    return response.json();
};
