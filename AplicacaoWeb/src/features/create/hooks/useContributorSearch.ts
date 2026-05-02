import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Contributor } from './useManualForm';
import { searchUsersService } from '../services/createService';
import { useDebounce } from '@/src/hooks/useDebounce';

export function useContributorSearch(data: any, setData: any) {
    const [searchEmail, setSearchEmail] = useState('');

    const debouncedEmail = useDebounce(searchEmail, 500);

    const { data: searchResults = [], isFetching: isSearching } = useQuery({
        queryKey: ['isers-search', debouncedEmail],
        queryFn: () => searchUsersService(debouncedEmail),
        enabled: debouncedEmail.trim().length >= 3,
        staleTime: 1000 * 60 * 5,
    });

    const handleSearchUser = (email: string) => {
        setSearchEmail(email);
    };

    const addContributor = (user: Contributor) => {
        if (!data.contributors.find((c: Contributor) => c.id === user.id)) {
            setData({ ...data, contributors: [...data.contributors, user] });
        }

        setSearchEmail('');
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
