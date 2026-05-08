import Link from 'next/link';
import FeedCardBase from './FeedCardBase';
import ChatMarkdown from '../../features/chat/components/ChatMarkdown';

interface AiCardProps {
    post: any;
    isFullView?: boolean;
}

export default function AiCard({ post, isFullView = false }: AiCardProps) {
    const postUrl = `/post/ai/${post.idPublic || post.id}`;

    let cleanAiResponse = post.aiResponse || '';
    if (cleanAiResponse) {
        cleanAiResponse = cleanAiResponse.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
    }

    return (
        <FeedCardBase post={post} postUrl={postUrl}>
            <div className="mb-2 mt-2">
                <span className="bg-primary text-text text-[0.70rem] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.gameName}
                </span>
            </div>

            {isFullView ? (
                <div className="block mb-4 mt-3">
                    <h2 className="text-xl font-extrabold text-text leading-tight">{post.title}</h2>
                </div>
            ) : (
                <Link
                    href={postUrl}
                    className="block mb-4 mt-3 hover:text-primary transition-colors"
                >
                    <h2 className="text-xl font-extrabold text-text leading-tight">{post.title}</h2>
                </Link>
            )}

            <div
                className={`relative rounded-2xl border border-card-border bg-background shadow-sm ${!isFullView ? 'max-h-[22rem] overflow-hidden' : ''}`}
            >
                <div className="p-5 space-y-8">
                    <div className="flex w-full justify-end">
                        <div className="flex max-w-[85%] gap-3 flex-row-reverse text-right">
                            <div className="flex-shrink-0">
                                <img
                                    src={
                                        post.user?.img
                                            ? `/upload/${post.user.idPublic || post.user.id}/user/${post.user.img}`
                                            : '/img/iconePadrao.jpg'
                                    }
                                    className="w-9 h-9 rounded-full object-cover shadow-sm border border-card-border"
                                    alt="User Avatar"
                                />
                            </div>
                            <div className="relative mt-0.5 flex flex-col">
                                <div className="absolute top-0 -right-[7px] text-card w-2.5 h-3.5 z-0">
                                    <svg
                                        viewBox="0 0 8 13"
                                        width="100%"
                                        height="100%"
                                        className="fill-current"
                                    >
                                        <path d="M0 0v13L8 0z" />
                                    </svg>
                                </div>
                                <div className="relative z-10 px-4 py-2.5 bg-card rounded-2xl rounded-tr-none shadow-sm text-sm text-text">
                                    {post.promptUser}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full justify-start">
                        <div className="flex max-w-[85%] gap-3 flex-row">
                            <div className="flex-shrink-0">
                                <img
                                    src="/img/iconePadrao.jpg"
                                    className="w-9 h-9 rounded-full object-cover shadow-sm border border-card-border"
                                    alt="AI Avatar"
                                />
                            </div>
                            <div className="relative mt-0.5 flex flex-col">
                                <div className="absolute top-0 -left-[7px] text-card w-2.5 h-3.5 z-0">
                                    <svg
                                        viewBox="0 0 8 13"
                                        width="100%"
                                        height="100%"
                                        className="fill-current"
                                    >
                                        <path d="M8 0v13L0 0z" />
                                    </svg>
                                </div>
                                <div className="relative z-10 px-4 py-2.5 bg-card rounded-2xl rounded-tl-none shadow-sm text-sm text-text">
                                    <ChatMarkdown content={cleanAiResponse} isTyping={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isFullView && (
                    <Link href={postUrl}>
                        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background via-background/90 to-transparent z-30 pointer-events-none rounded-b-2xl" />
                        <div className="absolute bottom-0 left-0 right-0 z-40 p-5 flex justify-start">
                            <span className="text-text font-bold text-xs group-hover:underline">
                                Ver conversa completa
                            </span>
                        </div>
                    </Link>
                )}
            </div>
        </FeedCardBase>
    );
}
