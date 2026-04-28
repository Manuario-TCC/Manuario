export const postService = {
    getPostByIdPublic: async (tipo: string, idPublic: string) => {
        const res = await fetch(`/api/post/${tipo}/${idPublic}`);
        if (!res.ok) {
            throw new Error('Postagem não encontrada');
        }
        return res.json();
    },
};
