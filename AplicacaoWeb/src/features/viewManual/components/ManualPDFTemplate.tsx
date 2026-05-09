import React from 'react';
import MarkdownViewer from '@/src/components/MarkdownViewer';

interface ManualPDFTemplateProps {
    data: any;
}

export const ManualPDFTemplate: React.FC<ManualPDFTemplateProps> = ({ data }) => {
    if (!data) return null;

    const bannerImg = data.imgBanner
        ? `/upload/manual/${data.idPublic}/img/${data.imgBanner}`
        : '/img/bannerPadrao.png';
    const logoImg = data.imgLogo
        ? `/upload/manual/${data.idPublic}/img/${data.imgLogo}`
        : '/img/iconePadrao.jpg';

    return (
        <div
            className="absolute top-0 left-0 opacity-0 pointer-events-none bg-white"
            style={{ width: '210mm' }}
        >
            <div id="pdf-export-content" className="bg-white text-black w-full font-sans">
                <div
                    className="relative w-full h-[297mm] flex flex-col items-center overflow-hidden"
                    style={{ backgroundColor: '#0f0d12', pageBreakAfter: 'always' }}
                >
                    <div className="w-full h-[160mm] relative overflow-hidden">
                        <img
                            src={bannerImg}
                            alt="Banner"
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to top, #0f0d12 0%, rgba(15, 13, 18, 0.6) 40%, transparent 100%)',
                            }}
                        />

                        <div
                            className="absolute bottom-0 left-0 right-0 h-32"
                            style={{
                                background: 'linear-gradient(to top, #0f0d12, transparent)',
                            }}
                        />
                    </div>

                    <div className="relative z-10 -mt-32 mb-12">
                        <img
                            src={logoImg}
                            alt="Logo"
                            className="w-64 h-64 rounded-3xl shadow-2xl object-cover"
                            crossOrigin="anonymous"
                        />
                    </div>

                    <div className="px-10 text-center relative z-10">
                        <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                            {data.name}
                        </h1>
                    </div>
                </div>

                <div
                    className="w-full h-[297mm] p-20 bg-white text-zinc-900 flex flex-col"
                    style={{ backgroundColor: '#ffffff', pageBreakAfter: 'always' }}
                >
                    <h2 className="text-5xl font-black mb-12 border-b-8 border-zinc-900 pb-6 uppercase italic">
                        Ficha Técnica
                    </h2>

                    <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                        <DataField label="Nome do Manual" value={data.name} />
                        <DataField label="Jogo Base" value={data.game} />
                        <DataField label="Gênero" value={data.genre} />
                        <DataField label="Tipo de Jogo" value={data.type} />
                        <DataField label="Edição / Versão" value={data.edition} />
                        <DataField
                            label="Faixa Etária"
                            value={data.ageRange ? `${data.ageRange}+ anos` : '-'}
                        />
                        <DataField
                            label="Jogadores"
                            value={`${data.minPlayers} a ${data.maxPlayers}`}
                        />
                        <DataField label="Tempo de Partida" value={`${data.playTime} min`} />

                        {data.system && (
                            <div className="col-span-2">
                                <DataField label="Sistema do Jogo" value={data.system} />
                            </div>
                        )}
                    </div>

                    {data.description && (
                        <div className="mt-16 p-8 bg-zinc-50 rounded-2xl border-2 border-zinc-100">
                            <span className="text-zinc-400 font-black uppercase text-sm tracking-widest block mb-4">
                                Introdução
                            </span>
                            <p className="text-xl leading-relaxed text-zinc-700 italic">
                                "{data.description}"
                            </p>
                        </div>
                    )}

                    <div className="mt-auto pt-10 border-t border-zinc-100 flex justify-between items-end text-zinc-400">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest">Autor</p>
                            <p className="text-lg text-zinc-900 font-medium">{data.user?.name}</p>
                        </div>
                        <p className="text-sm">
                            Gerado via Manuario — {new Date().toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                </div>

                <div className="w-full p-20 bg-white" style={{ backgroundColor: '#ffffff' }}>
                    <h2 className="text-5xl font-black mb-12 border-b-8 border-zinc-900 pb-6 uppercase italic text-zinc-900">
                        Regras do Jogo
                    </h2>

                    <div className="flex flex-col gap-16">
                        {data.rules
                            ?.filter((r: any) => !r.isDisabled)
                            .map((rule: any) => {
                                // Verifica se a regra é clonada ou privada
                                const isClonada = Boolean(rule.originManualId);
                                const isPrivada = rule.status !== 'PUBLICADO';

                                return (
                                    <div key={rule.id} style={{ pageBreakInside: 'avoid' }}>
                                        <h3 className="text-3xl font-black mb-6 text-zinc-900 uppercase flex items-center flex-wrap gap-4">
                                            <div className="flex items-center gap-4">
                                                <span className="w-3 h-10 bg-zinc-900 shrink-0"></span>
                                                {rule.name}
                                            </div>

                                            <div className="flex gap-2">
                                                {isClonada && (
                                                    <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-purple-200">
                                                        Clonada
                                                    </span>
                                                )}

                                                {isPrivada && (
                                                    <span className="text-sm bg-zinc-200 text-zinc-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-zinc-300">
                                                        Privada
                                                    </span>
                                                )}
                                            </div>
                                        </h3>
                                        <div className="prose prose-slate prose-xl max-w-none text-zinc-800 markdown-pdf-content">
                                            <MarkdownViewer content={rule.description} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .markdown-pdf-content * { color: #1a1a1a !important; }
                .markdown-pdf-content h1, .markdown-pdf-content h2, .markdown-pdf-content h3 { 
                    color: #000000 !important; font-weight: 800 !important; 
                }
                .markdown-pdf-content strong { color: #000000 !important; font-weight: 900 !important; }
                .markdown-pdf-content img { max-width: 100%; border-radius: 12px; margin: 20px 0; }
            `,
                }}
            />
        </div>
    );
};

function DataField({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex flex-col gap-1 border-l-4 border-zinc-100 pl-4">
            <span className="text-zinc-400 font-black uppercase text-xs tracking-widest">
                {label}
            </span>
            <span className="text-2xl font-bold text-zinc-900">{value || '-'}</span>
        </div>
    );
}
