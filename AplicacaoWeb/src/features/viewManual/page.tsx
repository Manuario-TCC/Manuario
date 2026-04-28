'use client';

import { useManual } from './hooks/useManual';
import { useManualRegras } from './hooks/useManualRegras';
import { ManualHeader } from './components/ManualHeader';
import { RuleCard } from './components/RuleCard';
import { Search } from 'lucide-react';

export default function ViewManualFeature({ id }: { id: string }) {
    const { manual, loading, error } = useManual(id);
    const { regras, searchQuery, setSearchQuery, hasMore, loadingRegras, loadMore } =
        useManualRegras(id);

    if (error && !loading) {
        return (
            <div className="p-8 text-center bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 m-4">
                {error}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 pb-40">
            <ManualHeader manual={manual} loading={loading} />

            <div className="w-full px-6 md:px-12">
                <div className="flex flex-col items-start mb-6 gap-4">
                    <h2 className="text-base text-text">Regras</h2>

                    <div className="relative w-full md:w-96 max-w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-sub-text" />
                        </div>

                        <input
                            type="text"
                            placeholder="Buscar regras..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray rounded-lg text-text focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {loading || (loadingRegras && regras.length === 0) ? (
                        <>
                            <RuleCard loading />
                            <RuleCard loading />
                            <RuleCard loading />
                        </>
                    ) : (
                        regras.map((regra) => (
                            <RuleCard
                                key={regra.idPublic}
                                regra={regra}
                                manualId={manual?.id}
                                manualUserId={manual?.user?.idPublico}
                            />
                        ))
                    )}

                    {!loading && !loadingRegras && regras.length === 0 && (
                        <div className="text-center py-10 text-sub-text">
                            Nenhuma regra encontrada.
                        </div>
                    )}
                </div>

                {hasMore && regras.length > 0 && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={loadingRegras}
                            className="px-6 py-2 bg-transparent border border-gray hover:bg-gray/50 text-text rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loadingRegras ? 'Carregando...' : 'Carregar mais'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
