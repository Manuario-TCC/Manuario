import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../services/recommendationService';

export const useRecommendations = (type: string, gameName: string, currentId: string) => {
    return useQuery({
        queryKey: ['recommendations', type, gameName, currentId],
        queryFn: () => getRecommendations(type, gameName, currentId),
        enabled: !!type && !!gameName,
    });
};
