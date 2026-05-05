import { Search } from 'lucide-react';
import SearchFilters from './SearchFilters';

interface SearchHeaderProps {
    query: string;
    setQuery: (q: string) => void;
    type: string;
    setType: (t: string) => void;
    filters: any;
    setFilters: (f: any) => void;
}

export default function SearchHeader({
    query,
    setQuery,
    type,
    setType,
    filters,
    setFilters,
}: SearchHeaderProps) {
    const tabs = [
        { id: 'manual', label: 'Manual' },
        { id: 'regras', label: 'Regras' },
        { id: 'pessoas', label: 'Pessoas' },
    ];

    return (
        <div className="relative w-full mb-10 group">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1 flex items-center bg-card border border-card-border rounded-2xl p-1.5 transition-all shadow-sm w-full">
                    <Search size={20} className="absolute left-4 text-sub-text transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="O que você busca?"
                        className="w-full bg-transparent py-3 pl-11 pr-4 sm:pr-[15.5rem] text-text outline-none text-base placeholder:text-sub-text"
                    />

                    <div className="hidden sm:flex absolute right-1.5 items-center gap-3">
                        <div className="w-[1px] h-6 bg-sub-text"></div>
                        <div className="flex bg-background/50 backdrop-blur-sm rounded-xl p-2 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setType(tab.id)}
                                    className={`px-3 py-1.5 text-[11px] uppercase font-black rounded-lg transition-all cursor-pointer ${
                                        type === tab.id
                                            ? 'bg-primary text-text shadow-md scale-[1.02]'
                                            : 'text-sub-text hover:text-text hover:bg-card-border/30'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex sm:hidden w-full bg-card border border-card-border rounded-2xl p-1.5 gap-1 shadow-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setType(tab.id)}
                            className={`flex-1 py-3 text-[11px] uppercase font-black rounded-xl transition-all cursor-pointer ${
                                type === tab.id
                                    ? 'bg-primary text-text shadow-md'
                                    : 'text-sub-text hover:text-text hover:bg-card-border/30'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {type === 'manual' && <SearchFilters filters={filters} setFilters={setFilters} />}
        </div>
    );
}
