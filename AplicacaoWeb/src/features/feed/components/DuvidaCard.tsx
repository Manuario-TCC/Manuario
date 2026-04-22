import Link from 'next/link';
import MarkdownViewer from './MarkdownViewer';
import FeedCardBase from './FeedCardBase';

export default function DuvidaCard({ post }: { post: any }) {
    const postUrl = `/duvida/${post.id}`;

    return (
        <FeedCardBase post={post} postUrl={postUrl}>
            <div className="mb-2 mt-2">
                <span className="bg-secondary text-text text-sm font-bold px-4 py-1 rounded-[0.4rem] uppercase tracking-tight">
                    {post.game}
                </span>
            </div>

            <Link href={postUrl} className="block mb-2 mt-4">
                <h2 className="text-lg font-bold text-text leading-snug">{post.name}</h2>
            </Link>

            <Link href={postUrl} className="block group cursor-pointer relative">
                <div className="max-h-[12.5rem] overflow-hidden relative">
                    <div className="text-sm">
                        <MarkdownViewer content={post.description} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                </div>
                <span className="text-text font-bold text-xs mt-1 inline-block hover:underline">
                    Ver dúvida completa
                </span>
            </Link>
        </FeedCardBase>
    );
}
