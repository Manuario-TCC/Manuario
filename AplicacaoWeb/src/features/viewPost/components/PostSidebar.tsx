'use client';

import Link from 'next/link';
import { useRecommendations } from '../hooks/useRecommendations';
import { formatTimeAgo } from '../../../utils/formatTimeAgo';
import { MessageCircleQuestion } from 'lucide-react';

interface PostSidebarProps {
    type: string;
    gameName: string;
    currentIdPublic: string;
    loggedUserId?: string | null;
}

const RecommendationSkeleton = () => (
    <div className="flex items-start gap-3 p-3 animate-pulse">
        <div className="w-16 h-16 bg-card-border/20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-1">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-card-border/20 rounded-full shrink-0" />
                <div className="h-3 bg-card-border/20 rounded w-24" />
            </div>
            <div className="h-4 bg-card-border/20 rounded w-full" />
            <div className="h-3 bg-card-border/10 rounded w-[60%]" />
        </div>
    </div>
);

export function PostSidebar({ type, gameName, currentIdPublic }: PostSidebarProps) {
    const { data: recommendations, isLoading } = useRecommendations(
        type,
        gameName,
        currentIdPublic,
    );

    const hasRecommendations = recommendations && recommendations.length > 0;
    const fallbackImg = '/img/iconePadrao.jpg';

    if (!isLoading && !hasRecommendations) {
        return null;
    }

    return (
        <aside className="w-full lg:w-[21rem] flex flex-col gap-6 shrink-0 mt-8 lg:mt-0 sticky top-8">
            <div className="bg-card border border-card-border/50 rounded-2xl p-4 shadow-sm">
                <h3 className="text-base font-bold text-text/90 mb-4 px-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Mais sobre <span>{gameName}</span>
                </h3>

                <div className="flex flex-col gap-1">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                              <RecommendationSkeleton key={i} />
                          ))
                        : recommendations.map((item: any) => {
                              const isRule = type === 'rules';
                              const manualImg =
                                  isRule && item.manuals?.[0]?.imgLogo
                                      ? `/upload/manual/${item.manuals[0].idPublic}/img/${item.manuals[0].imgLogo}`
                                      : null;
                              const userImg =
                                  item.user?.img && item.user?.idPublic
                                      ? `/upload/${item.user.idPublic}/user/${item.user.img}`
                                      : null;

                              return (
                                  <Link
                                      key={item.idPublic}
                                      href={`/post/${type}/${item.idPublic}`}
                                      className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-card-border/20 active:scale-[0.98] border border-transparent hover:border-card-border/50"
                                  >
                                      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-card-border/30 border border-card-border/50 mt-0.5">
                                          {isRule ? (
                                              <img
                                                  src={manualImg || fallbackImg}
                                                  alt={item.name}
                                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                              />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center text-text">
                                                  <MessageCircleQuestion
                                                      size={24}
                                                      strokeWidth={1.5}
                                                  />
                                              </div>
                                          )}
                                      </div>

                                      <div className="flex flex-col flex-1 min-w-0">
                                          <div className="flex items-center gap-1 text-xs text-sub-text font-medium">
                                              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-card-border/50">
                                                  <img
                                                      src={userImg || fallbackImg}
                                                      alt={item.user?.name || 'User'}
                                                      className="w-full h-full object-cover"
                                                  />
                                              </div>

                                              <span className="truncate max-w-[7rem] text-text/90 font-bold">
                                                  {item.user?.name?.split(' ')[0] || 'Anônimo'}
                                              </span>

                                              <span>•</span>

                                              <span className="whitespace-nowrap">
                                                  {formatTimeAgo(item.createdAt)}
                                              </span>
                                          </div>

                                          <h4 className="text-[0.95rem] font-bold text-text leading-snug line-clamp-2 mt-1">
                                              {item.name}
                                          </h4>

                                          <div className="flex items-center gap-1.5 text-[0.7rem] text-sub-text font-medium mt-1.5">
                                              <span>{item.likeCount || 0} likes</span>
                                              <span className="opacity-40">•</span>
                                              <span>{item.commentCount || 0} comentários</span>
                                          </div>
                                      </div>
                                  </Link>
                              );
                          })}
                </div>

                {recommendations?.length > 5 && (
                    <button className="w-full mt-4 py-3 text-[0.7rem] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider border-t border-card-border/20">
                        Ver mais posts
                    </button>
                )}
            </div>
        </aside>
    );
}
