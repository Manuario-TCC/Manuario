'use client';

import Link from 'next/link';
import { useRecommendations } from '../hooks/useRecommendations';
import { formatTimeAgo } from '../../../utils/formatTimeAgo';
import { ShoppingCart, MessageCircleQuestion } from 'lucide-react';

interface PostSidebarProps {
    type: string;
    gameName: string;
    currentIdPublic: string;
}

export function PostSidebar({ type, gameName, currentIdPublic }: PostSidebarProps) {
    const { data: recommendations, isLoading } = useRecommendations(
        type,
        gameName,
        currentIdPublic,
    );
    const hasRecommendations = recommendations && recommendations.length > 0;

    const fallbackImg = '/img/iconePadrao.jpg';

    return (
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0 mt-8 lg:mt-0">
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm">
                {(isLoading || hasRecommendations) && (
                    <>
                        <h3 className="text-base font-bold text-text mb-5 px-1">
                            Mais sobre <span>{gameName}</span>
                        </h3>

                        <div className="flex flex-col gap-3">
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                      <div
                                          key={i}
                                          className="h-16 w-full bg-card-border/20 animate-pulse rounded-xl"
                                      />
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

                                      const displayUserImg = userImg || fallbackImg;

                                      return (
                                          <Link
                                              key={item.idPublic}
                                              href={`/post/${type}/${item.idPublic}`}
                                              className="group flex items-center gap-4 p-3 rounded-xl bg-card-border/10 border border-transparent hover:border-primary/30 hover:bg-card-border/30 hover:shadow-sm transition-all duration-300"
                                          >
                                              <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl border border-card-border/50 bg-card-border/20 flex items-center justify-center">
                                                  {isRule ? (
                                                      <img
                                                          src={manualImg || fallbackImg}
                                                          alt={item.name}
                                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                      />
                                                  ) : (
                                                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-text">
                                                          <MessageCircleQuestion
                                                              size={24}
                                                              strokeWidth={1.5}
                                                          />
                                                      </div>
                                                  )}
                                              </div>

                                              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                                  <h4 className="text-sm font-bold text-text line-clamp-2 leading-snug">
                                                      {item.name}
                                                  </h4>

                                                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                                      <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-card-border/50">
                                                          <img
                                                              src={displayUserImg}
                                                              alt={item.user?.name || 'User'}
                                                              className="w-full h-full object-cover"
                                                          />
                                                      </div>
                                                      <span className="truncate max-w-[5rem]">
                                                          {item.user?.name?.split(' ')[0] ||
                                                              'Anônimo'}
                                                      </span>
                                                      <span className="opacity-50">•</span>
                                                      <span className="opacity-80">
                                                          {formatTimeAgo(item.createdAt)}
                                                      </span>
                                                  </div>
                                              </div>
                                          </Link>
                                      );
                                  })}
                        </div>

                        <hr className="border-card-border/50 my-6" />
                    </>
                )}

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-card-border rounded-xl bg-gradient-to-b from-transparent to-card-border/10 text-center group cursor-help transition-colors hover:border-primary/50">
                    <div className="w-12 h-12 mb-3 rounded-full bg-primary/50 text-text flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ShoppingCart size={20} strokeWidth={2} />
                    </div>
                    <span className="text-[0.6rem] uppercase tracking-widest font-extrabold text-primary mb-1">
                        Marketplace
                    </span>
                    <p className="text-sm text-text font-bold">Comparador de Preços</p>
                </div>
            </div>
        </aside>
    );
}
