'use client';

import { useState, useEffect } from 'react';
import { getMe } from '../services/menuService';

export function useMenuUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getMe();

                setUser(data);
            } catch (error) {
                console.error('Erro ao buscar usuário do menu:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading };
}
