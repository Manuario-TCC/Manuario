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
    const [filters, setFilters] = useState({});

    const debouncedQuery = useDebounce(query, 500);
    const {
        data: results,
        isLoading,
        isError,
        isFetching,
    } = useSearch(debouncedQuery, type, filters);

    const hasFilters = Object.keys(filters).length > 0;

    const renderResults = () => {
        if (!debouncedQuery.trim() && !hasFilters) return <EmptySearch />;

        if (isError) {
            return <div className="text-center text-red-500 mt-10">Erro na busca.</div>;
        }

        if (isLoading || isFetching) return <SearchSkeleton />;

        if (!results || results.length === 0)
            return (
                <div className="text-center text-sub-text mt-10">Nenhum resultado encontrado.</div>
            );

        return (
            <div className="flex flex-col gap-3">
                {results.map((item: any) => {
                    if (type === 'manual') {
                        return <ManualResult key={item.idPublic} manual={item} />;
                    }

                    if (type === 'regras') {
                        return (
                            <div className="flex justify-center align-center">
                                <RegraCard key={item.idPublic} post={item} />
                            </div>
                        );
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
        <div className="w-full max-w-4xl mx-auto pb-20 pt-12 px-4">
            <SearchHeader
                query={query}
                setQuery={setQuery}
                type={type}
                setType={setType}
                filters={filters}
                setFilters={setFilters}
            />
            {renderResults()}
        </div>
    );
}
