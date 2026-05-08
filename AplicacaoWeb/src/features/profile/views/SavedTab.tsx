'use client';

import { Bookmark } from 'lucide-react';
import { useSavedSnippets } from '../hooks/useSavedSnippets';
import { SavedGameGroup } from '../components/SavedGameGroup';

const SavedSkeleton = () => (
    <div className="flex flex-col gap-6 w-full animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-card-border rounded-2xl p-6 h-20" />
        ))}
    </div>
);

export const SavedTab = () => {
    const { games, isLoadingGames, isErrorGames, deleteSnippet } = useSavedSnippets();

    if (isLoadingGames) return <SavedSkeleton />;
    if (isErrorGames) {
        return <div className="p-10 text-center text-red-500">Erro ao carregar favoritos.</div>;
    }

    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-sub-text">
                <Bookmark size={48} className="mb-4 opacity-10" />
                <p>Nenhuma resposta salva no momento.</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 pb-20">
            {games.map((game: any) => (
                <SavedGameGroup key={game.name} game={game} deleteSnippet={deleteSnippet} />
            ))}
        </div>
    );
};
