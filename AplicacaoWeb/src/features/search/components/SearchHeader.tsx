import { Search } from 'lucide-react';

interface SearchHeaderProps {
    query: string;
    setQuery: (q: string) => void;
    type: string;
    setType: (t: string) => void;
}

export default function SearchHeader({ query, setQuery, type, setType }: SearchHeaderProps) {
    const tabs = [
        { id: 'manual', label: 'Manual' },
        { id: 'regras', label: 'Regras' },
        { id: 'pessoas', label: 'Pessoas' },
    ];

    return (
        <div className="relative w-full mb-10 group">
            <div className="relative flex items-center bg-card border border-card-border rounded-2xl p-1.5 transition-all shadow-sm">
                <Search size={20} className="absolute left-4 text-sub-text transition-colors" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="O que você busca?"
                    className="w-full bg-transparent py-3 pl-11 pr-[15.5rem] text-text outline-none text-base placeholder:text-sub-text"
                />

                <div className="absolute right-1.5 flex items-center gap-3">
                    <div className="w-[1px] h-6 bg-sub-text"></div>

                    <div className="flex bg-background/50 backdrop-blur-sm rounded-xl p-2 gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setType(tab.id)}
                                className={`px-3 py-1.5 text-[11px] uppercase font-black rounded-lg transition-all ${
                                    type === tab.id
                                        ? 'bg-primary text-text shadow-md scale-[1.02]'
                                        : 'text-text/40 hover:text-text hover:bg-card-border/30'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
