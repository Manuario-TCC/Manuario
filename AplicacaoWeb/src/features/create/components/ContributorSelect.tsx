import { X, Search, Loader2 } from 'lucide-react';
import { useContributorSearch } from '../hooks/useContributorSearch';

export function ContributorSelect({ data, setData }: any) {
    const {
        searchEmail,
        searchResults,
        isSearching,
        handleSearchUser,
        addContributor,
        removeContributor,
    } = useContributorSearch(data, setData);

    const getAvatarUrl = (user: any) => {
        if (user.img) {
            if (user.img.startsWith('http') || user.img.startsWith('/')) return user.img;
            return `/upload/${user.idPublico}/user/${user.img}`;
        }
        return '/img/iconePadrao.jpg';
    };

    const inputBaseClass =
        'w-full rounded-2xl bg-transparent border border-card-border px-4 text-sm outline-none focus:border-primary/50 transition-all text-foreground';

    return (
        <div className="bg-transparent p-5 rounded-2xl border border-card-border">
            <label className="block text-sm font-semibold text-sub-text mb-3">
                Contribuidores (Opcional)
            </label>

            {data.contributors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {data.contributors.map((c: any, index: number) => {
                        const uniqueKey = c.id || c.idPublico || `contributor-${index}`;

                        return (
                            <span
                                key={uniqueKey}
                                className="flex items-center gap-2 bg-background text-text px-3 py-1.5 rounded-full text-sm font-medium border border-card-border"
                            >
                                <img
                                    src={getAvatarUrl(c)}
                                    alt={c.name}
                                    className="w-5 h-5 rounded-full object-cover border border-gray"
                                />
                                {c.name}
                                <button
                                    onClick={() => removeContributor(c.id || c.idPublico)}
                                    className="hover:text-red-500 ml-1 transition-colors cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            <div className="relative">
                <div
                    className={`flex items-center h-12 px-4 ${inputBaseClass} focus-within:border-primary/50`}
                >
                    <Search size={18} className="text-muted-foreground mr-2" />
                    <input
                        type="email"
                        placeholder="Buscar por email..."
                        className="bg-transparent w-full outline-none text-sm text-foreground"
                        value={searchEmail}
                        onChange={(e) => handleSearchUser(e.target.value)}
                    />
                    {isSearching && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </div>

                {searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-background border border-card-border rounded-xl shadow-lg overflow-hidden flex flex-col max-h-60 overflow-y-auto">
                        {searchResults.map((user: any, index: number) => {
                            const searchKey = user.id || user.idPublico || `search-${index}`;

                            return (
                                <button
                                    key={searchKey}
                                    onClick={() => addContributor(user)}
                                    className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-card-border last:border-0 cursor-pointer"
                                >
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-foreground">
                                            {user.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {user.email}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
