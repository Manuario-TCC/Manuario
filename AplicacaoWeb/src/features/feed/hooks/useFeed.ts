import { useInfiniteQuery } from '@tanstack/react-query';
import { feedService } from '../services/feedService';

export const FEED_QUERY_KEY = ['feed', 'following'];

export function useFeed() {
    const LIMIT = 10;

    return useInfiniteQuery({
        queryKey: FEED_QUERY_KEY,
        queryFn: ({ pageParam = 0 }) => feedService.getFeed(LIMIT, pageParam as number),
        initialPageParam: 0,

        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.isRecommendation) {
                return undefined;
            }

            if (lastPage.posts.length < LIMIT) {
                return undefined;
            }

            const totalItemsLoaded = allPages.reduce((acc, page) => acc + page.posts.length, 0);
            return totalItemsLoaded;
        },
    });
}
