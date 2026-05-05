export const fetchSearchResults = async (query: string, type: string, filters: any = {}) => {
    if (!query.trim() && Object.keys(filters).length === 0) return [];

    const params = new URLSearchParams({
        type: type,
    });

    if (query.trim()) {
        params.append('q', query);
    }

    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            params.append(key, filters[key]);
        }
    });

    const res = await fetch(`/api/search?${params.toString()}`);

    if (!res.ok) {
        throw new Error('Erro ao realizar a busca');
    }
    return res.json();
};
