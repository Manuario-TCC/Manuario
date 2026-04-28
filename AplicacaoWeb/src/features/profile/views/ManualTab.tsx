'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useManuals } from '../hooks/useManuals';

interface ManualTabProps {
    idPublic: string;
}

export const ManualTab: React.FC<ManualTabProps> = ({ idPublic }) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useManuals(idPublic);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-[6.5rem] bg-card-border/20 animate-pulse rounded-xl"
                    />
                ))}
            </div>
        );
    }

    const manuals = data?.pages.flatMap((page) => page.items) || [];

    if (manuals.length === 0) {
        return <div className="py-20 text-center text-sub-text">Nenhum manual encontrado.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {manuals.map((manual) => {
                    const logoUrl = manual.imgLogo
                        ? `/upload/manual/${manual.idPublic}/img/${manual.imgLogo}`
                        : '/img/iconePadrao.jpg';

                    return (
                        <Link
                            href={`/manual/${manual.idPublic}`}
                            key={manual.idPublic}
                            className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4 hover:border-primary transition-all duration-200 group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                        >
                            <img
                                src={logoUrl}
                                alt={manual.name}
                                className="w-16 h-16 rounded-lg object-cover border border-card-border shrink-0"
                            />

                            <div className="flex flex-col flex-1 min-w-0">
                                <h3
                                    className="text-text font-bold truncate text-sm"
                                    title={manual.name}
                                >
                                    {manual.name}
                                </h3>
                                <p
                                    className="text-sub-text text-xs truncate mt-0.5"
                                    title={manual.game}
                                >
                                    {manual.game}
                                </p>
                            </div>

                            <div className="text-card-border group-hover:text-primary transition-colors shrink-0">
                                <ChevronRight size={20} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="py-3 rounded-xl border border-card-border bg-card text-text text-sm font-bold hover:bg-card-border transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                    {isFetchingNextPage ? (
                        <div className="w-5 h-5 border-2 border-text border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Carregar mais manuais'
                    )}
                </button>
            )}
        </div>
    );
};
