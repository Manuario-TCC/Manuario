'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, ScrollText, Sparkles } from 'lucide-react';
import DuvidaCard from '@/src/components/cards/DuvidaCard';
import RegraCard from '@/src/components/cards/RegraCard';
import { usePublications } from '../hooks/usePublications';

type SubTabType = 'duvida' | 'regra' | 'ia';

interface PublicationsTabProps {
    idPublic: string;
}

const PostSkeleton = () => (
    <div className="flex w-full animate-pulse flex-col p-4 border border-card-border rounded-xl bg-background shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-card-border/50" />
            <div className="flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-card-border/50" />
                <div className="h-3 w-24 rounded bg-card-border/50" />
            </div>
        </div>
        <div className="h-6 w-1/3 rounded bg-card-border/50 mb-3" />
        <div className="h-16 w-full rounded bg-card-border/50" />
    </div>
);

export const PublicationsTab: React.FC<PublicationsTabProps> = ({ idPublic }) => {
    const [activeTab, setActiveTab] = useState<SubTabType>('duvida');

    const tabs = [
        { id: 'duvida', label: 'Dúvidas', icon: MessageSquareQuote },
        { id: 'regra', label: 'Regras', icon: ScrollText },
        { id: 'ia', label: 'Post IA', icon: Sparkles },
    ] as const;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        usePublications(idPublic, activeTab);

    const renderContent = () => {
        if (activeTab === 'ia') {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-sub-text">
                    <Sparkles size={48} className="mb-4 opacity-20" />
                    <p>Funcionalidade de IA em breve.</p>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="flex flex-col gap-2 w-full mt-4">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            );
        }

        if (isError) {
            return (
                <div className="py-10 text-center text-red-500">Erro ao carregar publicações.</div>
            );
        }

        const posts = data?.pages.flatMap((page) => page.items || (page as any).data || []) || [];

        if (posts.length === 0) {
            return (
                <div className="py-10 text-center text-sub-text">
                    Nenhuma {activeTab === 'duvida' ? 'dúvida' : 'regra'} encontrada.
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-4 w-full mt-4">
                {posts.map((post: any) => {
                    if (activeTab === 'duvida') {
                        return <DuvidaCard key={post.id || post.idPublic} post={post} />;
                    }
                    if (activeTab === 'regra') {
                        return <RegraCard key={post.id || post.idPublic} post={post} />;
                    }
                    return null;
                })}

                {hasNextPage && (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="mt-6 py-3 w-full rounded-xl border border-card-border bg-card text-text font-bold hover:bg-card-border transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isFetchingNextPage ? (
                            <div className="w-5 h-5 border-2 border-text border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Carregar mais'
                        )}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col min-h-[300px]">
            <div className="mt-2 flex bg-transparent pb-4 mb-6">
                <div className="flex overflow-hidden rounded-full bg-background border border-card-border shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SubTabType)}
                                className={`relative flex items-center gap-2 rounded-full px-6 py-3 transition-colors ${
                                    isActive ? 'text-white' : 'text-sub-text hover:text-text'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="profile-tab-indicator"
                                        className="absolute inset-0 rounded-full bg-primary"
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}

                                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap text-sm font-bold">
                                    <Icon size={18} />
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="w-full max-w-2xl mx-auto">{renderContent()}</div>
        </div>
    );
};
