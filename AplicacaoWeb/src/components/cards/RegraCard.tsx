import Link from 'next/link';
import MarkdownViewer from '../MarkdownViewer';
import FeedCardBase from './FeedCardBase';
import { ChevronRight } from 'lucide-react';

interface RegraCardProps {
    post: any;
    isFullView?: boolean;
}

export default function RegraCard({ post, isFullView = false }: RegraCardProps) {
    const postUrl = `/post/rules/${post.idPublic}`;

    const manualRelacionado = post.manuals && post.manuals.length > 0 ? post.manuals[0] : null;

    const manualUrl = manualRelacionado ? `/manual/${manualRelacionado.idPublic}` : '#';

    const manualLogoUrl = manualRelacionado?.imgLogo
        ? `/upload/manual/${manualRelacionado.idPublic}/img/${manualRelacionado.imgLogo}`
        : '/img/iconePadrao.jpg';

    return (
        <FeedCardBase post={post} postUrl={postUrl}>
            <div className="mb-2 mt-2">
                <span className="bg-primary text-text text-sm font-bold px-4 py-1 rounded-[0.4rem] uppercase tracking-tight">
                    {manualRelacionado?.game || 'Regra'}
                </span>
            </div>

            <div className="bg-background border border-card-border rounded-lg overflow-hidden mb-2 mt-4">
                <div className="p-3 flex items-center justify-between border-b border-card-border">
                    <div className="flex items-center gap-3">
                        <img
                            src={manualLogoUrl}
                            alt="Logo Manual"
                            className="w-9 h-9 rounded-md object-cover border border-card-border"
                        />
                        <h2 className="text-text font-bold text-sm leading-tight max-w-[12rem]">
                            {post.name}
                        </h2>
                    </div>

                    <Link
                        href={manualUrl}
                        className="bg-card hover:bg-gray border border-card-border text-text text-[10px] uppercase font-black py-2 px-3 rounded-md transition-colors flex items-center gap-1"
                    >
                        Ver Manual
                        <ChevronRight size={14} />
                    </Link>
                </div>

                {isFullView ? (
                    <div className="block p-4">
                        <div className="text-sm">
                            <MarkdownViewer content={post.description} />
                        </div>
                    </div>
                ) : (
                    <Link href={postUrl} className="block p-4 group cursor-pointer relative">
                        <div className="max-h-[10rem] overflow-hidden relative">
                            <div className="text-sm">
                                <MarkdownViewer content={post.description} />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                        </div>
                        <span className="text-text font-bold text-xs mt-3 inline-block hover:underline">
                            Ver regra completa
                        </span>
                    </Link>
                )}
            </div>
        </FeedCardBase>
    );
}
