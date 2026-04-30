export function ProfileSkeleton() {
    return (
        <div className="relative w-full animate-pulse">
            <div className="h-[15.6rem] md:h-[17rem] w-full bg-gray/50" />

            <div className="w-full px-6 md:px-12 relative">
                <div className="flex flex-col md:flex-row gap-6 -mt-20 md:-mt-24 items-start">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-900 rounded-full overflow-hidden shrink-0 shadow-2xl relative">
                        <div className="w-full h-full bg-gray" />
                    </div>

                    <div className="flex-1 space-y-3 pt-20 md:pt-24 w-full">
                        <div className="h-8 bg-gray rounded w-1/3 mb-2" />
                        <div className="h-4 bg-gray/60 rounded w-1/4 mb-6" />

                        <div className="pt-4 space-y-2.5">
                            <div className="h-4 bg-gray/60 rounded w-full" />
                            <div className="h-4 bg-gray/60 rounded w-[85%]" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 mt-12 border-b border-gray/20 pb-4">
                    <div className="h-6 bg-gray rounded w-20" />
                    <div className="h-6 bg-gray rounded w-24" />
                    <div className="h-6 bg-gray rounded w-20" />
                </div>

                <div className="pt-8 space-y-6">
                    <div className="h-40 bg-gray/30 rounded-xl w-full" />
                    <div className="h-40 bg-gray/30 rounded-xl w-full" />
                </div>
            </div>
        </div>
    );
}
