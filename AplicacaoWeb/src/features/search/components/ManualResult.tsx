import Link from 'next/link';
import { ChevronRight, GitFork } from 'lucide-react';

export default function ManualResult({ manual }: { manual: any }) {
    const logoUrl = manual.imgLogo
        ? `/upload/manual/${manual.idPublic}/img/${manual.imgLogo}`
        : '/img/iconePadrao.jpg';

    return (
        <Link
            href={`/manual/${manual.idPublic}`}
            className="bg-card hover:bg-gray border border-card-border rounded-xl p-4 flex items-center justify-between transition-all group active:scale-[0.98]"
        >
            <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                    <img
                        src={logoUrl}
                        alt={manual.name}
                        className="w-full h-full rounded-lg object-cover border border-card-border shadow-sm"
                    />
                </div>
                <div>
                    <h3 className="text-text font-bold text-lg leading-tight">{manual.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sub-text text-xs font-medium uppercase tracking-wider">
                            {manual.game}
                        </p>

                        {manual.clonedFromId && (
                            <span className="flex items-center gap-1 bg-card-border/50 text-text/70 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tight">
                                <GitFork size={12} />
                                Fork
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} className="text-text" />
            </div>
        </Link>
    );
}
