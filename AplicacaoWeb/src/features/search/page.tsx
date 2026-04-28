'use client';

import { useState } from 'react';
import { useSearch } from './hooks/useSearch';
import { useDebounce } from '../../hooks/useDebounce';
import SearchHeader from './components/SearchHeader';
import ManualResult from './components/ManualResult';
import UserResult from './components/UserResult';
import EmptySearch from './components/EmptySearch';
import SearchSkeleton from './components/SearchSkeleton';
import RegraCard from '../../components/cards/RegraCard';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('manual');

    const debouncedQuery = useDebounce(query, 500);

    const { data: results, isLoading, isError, isFetching } = useSearch(debouncedQuery, type);

    const renderResults = () => {
        if (!debouncedQuery.trim()) return <EmptySearch />;

        if (isError) {
            return <div className="text-center text-red-500 mt-10">Erro na busca.</div>;
        }

        if (isLoading || isFetching) return <SearchSkeleton />;

        if (!results || results.length === 0)
            return (
                <div className="text-center text-sub-text mt-10">
                    Nenhum resultado para "{debouncedQuery}".
                </div>
            );

        return (
            <div className="flex flex-col gap-3">
                {results.map((item: any) => {
                    if (type === 'manual') {
                        return <ManualResult key={item.idPublic} manual={item} />;
                    }

                    if (type === 'regras') {
                        return <RegraCard key={item.idPublic} post={item} />;
                    }

                    if (type === 'pessoas') {
                        return <UserResult key={item.idPublic} user={item} />;
                    }

                    return null;
                })}
            </div>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto pb-20 pt-12 px-4">
            <SearchHeader query={query} setQuery={setQuery} type={type} setType={setType} />
            {renderResults()}
        </div>
    );
}
