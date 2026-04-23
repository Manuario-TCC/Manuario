export const postService = {
    getPostByIdPublico: async (tipo: string, idPublico: string) => {
        const res = await fetch(`/api/post/${tipo}/${idPublico}`);
        if (!res.ok) {
            throw new Error('Postagem não encontrada');
        }
        return res.json();
    },
};
