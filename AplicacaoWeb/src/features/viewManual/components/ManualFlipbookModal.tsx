'use client';

import React, { useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownViewer from '@/src/components/MarkdownViewer';
import HTMLFlipBook from 'react-pageflip';

interface ManualFlipbookModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const FlipBook = HTMLFlipBook as any;

export function ManualFlipbookModal({ isOpen, onClose, data }: ManualFlipbookModalProps) {
    if (!isOpen || !data) return null;

    const flipBook = useRef<any>(null);

    const bannerImg = data.imgBanner
        ? `/upload/manual/${data.idPublic}/img/${data.imgBanner}`
        : '/img/bannerPadrao.png';
    const logoImg = data.imgLogo
        ? `/upload/manual/${data.idPublic}/img/${data.imgLogo}`
        : '/img/iconePadrao.jpg';

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[110] cursor-pointer"
            >
                <X size={32} />
            </button>

            <div className="relative w-full max-w-[900px] h-[70vh] md:h-[80vh] flex justify-center items-center mt-4">
                <FlipBook
                    width={400}
                    height={600}
                    size="stretch"
                    minWidth={280}
                    maxWidth={450}
                    minHeight={400}
                    maxHeight={700}
                    maxShadowOpacity={0.4}
                    showCover={true}
                    mobileScrollSupport={true}
                    usePortrait={true}
                    drawShadow={true}
                    flippingTime={1000}
                    ref={flipBook}
                    className="shadow-2xl mx-auto"
                >
                    <div className="bg-[#0f0d12] w-full h-full overflow-hidden border-r border-white/10 relative">
                        <div className="w-full h-[55%] relative">
                            <img
                                src={bannerImg}
                                className="w-full h-full object-cover opacity-40"
                                alt="Banner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d12] to-transparent" />
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[15%] px-6 text-center">
                            <img
                                src={logoImg}
                                className="w-24 h-24 md:w-40 md:h-40 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-4 md:mb-6 border-4 border-[#1a1721] object-cover bg-zinc-900 z-10"
                                alt="Logo"
                            />
                            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg z-10 leading-tight">
                                {data.name}
                            </h1>
                            <p className="text-purple-400 mt-2 md:mt-4 font-bold tracking-widest text-[10px] md:text-xs z-10 bg-black/40 px-4 py-1.5 rounded-full border border-purple-500/20">
                                MANUAL OFICIAL
                            </p>
                        </div>
                    </div>

                    <div className="bg-white w-full h-full p-6 sm:p-10 flex flex-col overflow-y-auto border-l border-zinc-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mb-6 border-b-4 border-zinc-900 pb-2 uppercase italic">
                            Ficha Técnica
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            <InfoRow label="Jogo Base" value={data.game} />
                            <InfoRow label="Gênero" value={data.genre} />
                            <InfoRow
                                label="Jogadores"
                                value={`${data.minPlayers} a ${data.maxPlayers}`}
                            />
                            <InfoRow label="Tempo de Partida" value={`${data.playTime} min`} />
                            {data.system && <InfoRow label="Sistema" value={data.system} />}
                        </div>

                        {data.description && (
                            <div className="mt-6 p-4 bg-zinc-50 rounded-xl border-2 border-zinc-100">
                                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest block mb-2">
                                    Introdução
                                </span>
                                <p className="text-zinc-700 italic text-xs sm:text-sm leading-relaxed">
                                    "{data.description}"
                                </p>
                            </div>
                        )}
                    </div>

                    {data.rules
                        ?.filter((r: any) => !r.isDisabled)
                        .map((rule: any, index: number) => (
                            <div
                                key={rule.id}
                                className="bg-white w-full h-full p-6 sm:p-10 border-l border-zinc-200 overflow-y-auto relative shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]"
                            >
                                <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-4 uppercase flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-zinc-900"></span>
                                    {rule.name}
                                </h3>

                                <div className="prose prose-sm max-w-none text-zinc-800 pb-10">
                                    <MarkdownViewer content={rule.description} />
                                </div>

                                <div className="absolute bottom-4 right-6 text-zinc-300 font-black text-base">
                                    {index + 3}
                                </div>
                            </div>
                        ))}

                    <div className="bg-zinc-900 w-full h-full flex items-center justify-center border-l border-black">
                        <img
                            src={logoImg}
                            className="w-12 h-12 rounded-xl opacity-20 grayscale"
                            alt="Logo Watermark"
                        />
                    </div>
                </FlipBook>
            </div>

            <div className="fixed bottom-6 flex gap-6 z-[110]">
                <button
                    onClick={() => flipBook.current.pageFlip().flipPrev()}
                    className="p-3 md:p-4 bg-zinc-900/80 hover:bg-purple-600 text-white rounded-full transition-all border border-white/10 shadow-lg cursor-pointer backdrop-blur-md"
                    title="Página Anterior"
                >
                    <ChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>
                <button
                    onClick={() => flipBook.current.pageFlip().flipNext()}
                    className="p-3 md:p-4 bg-zinc-900/80 hover:bg-purple-600 text-white rounded-full transition-all border border-white/10 shadow-lg cursor-pointer backdrop-blur-md"
                    title="Próxima Página"
                >
                    <ChevronRight size={20} className="md:w-6 md:h-6" />
                </button>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .stf__item { height: 100% !important; }
            `,
                }}
            />
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col border-l-4 border-purple-500/20 pl-3">
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                {label}
            </span>
            <span className="text-zinc-900 font-bold text-sm md:text-base">{value || '-'}</span>
        </div>
    );
}
