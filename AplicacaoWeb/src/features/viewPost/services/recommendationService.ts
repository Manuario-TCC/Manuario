export const getRecommendations = async (type: string, gameName: string, currentId: string) => {
    const response = await fetch(
        `/api/recommendations?type=${type}&gameName=${encodeURIComponent(gameName)}&currentId=${currentId}`,
    );

    if (!response.ok) {
        throw new Error('Falha ao buscar recomendações');
    }

    return response.json();
};
