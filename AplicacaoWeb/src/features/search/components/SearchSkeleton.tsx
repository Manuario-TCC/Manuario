export default function SearchSkeleton() {
    return (
        <div className="flex flex-col gap-3 w-full">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4 animate-pulse"
                >
                    <div className="w-14 h-14 bg-card-border/40 rounded-lg"></div>

                    <div className="flex-1 flex flex-col gap-2">
                        <div className="h-4 bg-card-border/40 rounded w-2/4"></div>
                        <div className="h-3 bg-card-border/40 rounded w-1/4"></div>
                    </div>

                    <div className="w-8 h-8 bg-card-border/40 rounded-full"></div>
                </div>
            ))}
        </div>
    );
}
