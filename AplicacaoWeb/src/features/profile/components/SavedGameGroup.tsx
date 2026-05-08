'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { useInfiniteSavedSnippets } from '../hooks/useSavedSnippets';
import MarkdownViewer from '@/src/components/MarkdownViewer';

interface SavedGameGroupProps {
    game: { name: string; count: number };
    deleteSnippet: (id: string) => void;
}

export const SavedGameGroup: React.FC<SavedGameGroupProps> = ({ game, deleteSnippet }) => {
    const [isGroupExpanded, setIsGroupExpanded] = useState(false);
    const [expandedSnippetId, setExpandedSnippetId] = useState<string | null>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteSavedSnippets(isGroupExpanded ? game.name : '');

    const snippets = data?.pages.flat() || [];

    return (
        <div className="flex flex-col gap-4 bg-card border border-card-border rounded-2xl p-5 shadow-sm overflow-hidden">
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setIsGroupExpanded(!isGroupExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-primary" />
                    <h3 className="text-lg font-bold text-text uppercase tracking-tight group-hover:text-primary transition-colors">
                        {game.name}
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-sub-text font-medium bg-background px-2.5 py-1 rounded-full border border-card-border">
                        {game.count} {game.count === 1 ? 'item' : 'itens'}
                    </span>

                    <div
                        className={`text-sub-text transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`}
                    >
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isGroupExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-3 pt-2"
                    >
                        {isLoading ? (
                            <div className="py-8 flex justify-center">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                {snippets.map((snippet: any) => (
                                    <div
                                        key={snippet.id}
                                        className="bg-background border border-card-border rounded-xl overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between p-4 gap-4">
                                            <div
                                                className="flex-1 cursor-pointer flex items-start gap-3"
                                                onClick={() =>
                                                    setExpandedSnippetId(
                                                        expandedSnippetId === snippet.id
                                                            ? null
                                                            : snippet.id,
                                                    )
                                                }
                                            >
                                                <MessageSquare
                                                    size={16}
                                                    className="text-primary mt-1 shrink-0"
                                                />
                                                <p className="font-medium text-text text-sm line-clamp-2">
                                                    {snippet.promptUser}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteSnippet(snippet.id);
                                                    }}
                                                    className="p-2 text-sub-text hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setExpandedSnippetId(
                                                            expandedSnippetId === snippet.id
                                                                ? null
                                                                : snippet.id,
                                                        )
                                                    }
                                                    className={`p-2 text-sub-text transition-transform ${expandedSnippetId === snippet.id ? 'rotate-180' : ''}`}
                                                >
                                                    <ChevronDown size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        {expandedSnippetId === snippet.id && (
                                            <div className="px-4 pb-4 pt-2 border-t border-card-border/40 bg-card/10">
                                                <div className="prose prose-invert max-w-none text-sm">
                                                    <MarkdownViewer content={snippet.aiResponse} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {hasNextPage && (
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="mt-2 py-2 text-xs font-bold text-sub-text hover:text-text transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isFetchingNextPage ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            'Ver mais trechos'
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
