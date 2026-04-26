import { useState } from 'react';
import { Contributor } from './useManualForm';
import { searchUsersService } from '../services/createService';

export function useContributorSearch(data: any, setData: any) {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState<Contributor[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchUser = async (email: string) => {
        setSearchEmail(email);
        if (email.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchUsersService(email);
            setSearchResults(results);
        } catch (error) {
            console.error('Erro na busca de usuários', error);
        } finally {
            setIsSearching(false);
        }
    };

    const addContributor = (user: Contributor) => {
        if (!data.contributors.find((c: Contributor) => c.id === user.id)) {
            setData({ ...data, contributors: [...data.contributors, user] });
        }
        setSearchEmail('');
        setSearchResults([]);
    };

    const removeContributor = (id: string) => {
        setData({
            ...data,
            contributors: data.contributors.filter((c: Contributor) => c.id !== id),
        });
    };

    return {
        searchEmail,
        searchResults,
        isSearching,
        handleSearchUser,
        addContributor,
        removeContributor,
    };
}
