export const feedService = {
    getFeed: async (limit: number, offset: number) => {
        const [resDuvidas, resRegras] = await Promise.all([
            fetch(`/api/duvida?limit=${limit}&offset=${offset}`),
            fetch(`/api/regra?limit=${limit}&offset=${offset}`),
        ]);

        if (!resDuvidas.ok || !resRegras.ok) {
            throw new Error('Falha ao carregar as postagens do feed');
        }

        const duvidas = await resDuvidas.json();
        const regras = await resRegras.json();

        const duvidasFormatadas = duvidas.map((d: any) => ({ ...d, type: 'duvida' }));
        const regrasFormatadas = regras.map((r: any) => ({ ...r, type: 'regra' }));

        const combined = [...duvidasFormatadas, ...regrasFormatadas].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return combined.slice(0, limit);
    },
};
