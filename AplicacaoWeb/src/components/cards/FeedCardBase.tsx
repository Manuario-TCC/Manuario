import Link from 'next/link';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { MoreHorizontal, Heart, MessageCircle, Share2 } from 'lucide-react';
import { ReactNode } from 'react';

interface FeedCardBaseProps {
    post: any;
    postUrl: string;
    children: ReactNode;
}

export default function FeedCardBase({ post, postUrl, children }: FeedCardBaseProps) {
    const userIdUrl = post.user?.idPublico || post.user?.id;
    const userAvatarUrl = post.user?.img
        ? `/upload/${userIdUrl}/user/${post.user.img}`
        : '/img/iconePadrao.jpg';

    return (
        <div
            className={`bg-card border border-card-border rounded-xl p-5 mb-4 hover:border-gray transition-colors w-full shadow-md max-w-[40rem]`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <Link href={`/perfil/${userIdUrl}`}>
                        <img
                            src={userAvatarUrl}
                            alt={post.user.name}
                            className="w-10 h-10 rounded-full object-cover border border-card-border"
                        />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/perfil/${userIdUrl}`}
                            className="text-text font-bold text-base"
                        >
                            {post.user.name}
                        </Link>
                        <span className="text-sub-text text-sm flex items-center gap-2">
                            <span className="text-lg">•</span> {formatTimeAgo(post.createdAt)}
                        </span>
                    </div>
                </div>
                <button className="text-sub-text hover:text-text cursor-pointer transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {children}

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-card-border">
                <button className="flex items-center gap-1.5 text-sub-text cursor-pointer">
                    <Heart size="1.25rem" className="hover:text-red-500 transition-all" />
                    <span className="text-xs font-bold">{post.likeCount || 0}</span>
                </button>

                <Link href={postUrl} className="flex items-center gap-1.5 text-sub-text">
                    <MessageCircle size="1.25rem" className="hover:text-secondary transition-all" />
                    <span className="text-xs font-bold">{post.commentCount || 0}</span>
                </Link>

                <button className="flex items-center gap-1.5 text-sub-text ml-auto cursor-pointer hover:text-secondary transition-all">
                    <Share2 size="1rem" />
                </button>
            </div>
        </div>
    );
}
