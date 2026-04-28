export const fetchSearchResults = async (query: string, type: string) => {
    if (!query.trim()) return [];

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
    if (!res.ok) {
        throw new Error('Erro ao realizar a busca');
    }

    return res.json();
};
