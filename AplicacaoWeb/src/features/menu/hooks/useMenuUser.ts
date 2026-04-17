'use client';

import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/menuService';
import { useEffect } from 'react';
import { socket } from '@/src/utils/socket';
import { useQueryClient } from '@tanstack/react-query';

export function useMenuUser() {
    const queryClient = useQueryClient();

    const { data: user, isLoading: loading } = useQuery({
        queryKey: ['user-me'],
        queryFn: getMe,
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        socket.on('reload_profile_data', () => {
            queryClient.invalidateQueries({ queryKey: ['user-me'] });
        });

        return () => {
            socket.off('reload_profile_data');
        };
    }, [queryClient]);

    return { user, loading };
}
