'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Eye,
    SquareStack,
    Download,
    Dices,
    Dice6,
    Calendar,
    Swords,
    Info,
    Cpu,
    Clock,
    Users,
    Pencil,
    X,
    Share2,
} from 'lucide-react';
import { ContributorsModal } from './ContributorsModal';
import { customAlert } from '@/src/components/customAlert';

interface ManualHeaderProps {
    manual: any;
}

export function ManualHeader({ manual }: ManualHeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bannerImg = manual?.imgBanner
        ? `/upload/manual/${manual.idPublic}/img/${manual.imgBanner}`
        : '/img/bannerPadrao.png';

    const logoImg = manual?.imgLogo
        ? `/upload/manual/${manual.idPublic}/img/${manual.imgLogo}`
        : '/img/iconePadrao.jpg';

    const criador = manual?.user?.name || 'usuário';
    const criadorIdPublico = manual?.user?.idPublico;
    const contribuidores = manual?.contribuidores || [];
    const qtdContribuidores = contribuidores.length;
    const dataCriacao = manual?.createdAt
        ? new Date(manual.createdAt).toLocaleDateString('pt-BR')
        : '27/04/2026';

    // Função para copiar a URL atual
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            customAlert.toastSuccess('Link copiado!');
        } catch (err) {}
    };

    return (
        <div className="w-full text-zinc-100 relative">
            {manual?.idPublic && (
                <Link
                    href={`/create?tab=manual&id=${manual.idPublic}`}
                    className="absolute top-6 right-6 z-50 p-3 bg-zinc-900/50 backdrop-blur-md hover:bg-purple-600 text-white rounded-full transition-all shadow-lg border border-zinc-700/50 hover:border-purple-500"
                    title="Editar Manual"
                >
                    <Pencil className="w-[1.125rem] h-[1.125rem]" />
                </Link>
            )}

            <div className="w-full h-[18rem] md:h-[21rem] relative">
                <Image src={bannerImg} alt="Banner" fill className="object-cover" priority />

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="w-full px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 -mt-16 md:-mt-20 relative z-10 w-full">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background bg-zinc-800 shadow-xl shrink-0 relative">
                        <Image src={logoImg} alt="Logo" fill className="object-cover" />
                    </div>

                    <div className="flex flex-col flex-1 w-full text-center md:text-left pt-2 md:pt-4">
                        <div className="mb-4">
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                                    {manual?.name}
                                </h1>

                                <button
                                    onClick={handleShare}
                                    className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-all cursor-pointer"
                                    title="Compartilhar Manual"
                                >
                                    <Share2 size={24} />
                                </button>
                            </div>
                            <p className="text-zinc-400 text-xs mt-1.5 font-medium drop-shadow-md">
                                Criado por{' '}
                                {criadorIdPublico ? (
                                    <Link
                                        href={`/perfil/${criadorIdPublico}`}
                                        className="text-purple-500 font-bold hover:underline transition-all"
                                    >
                                        @{criador.toLowerCase().replace(/\s/g, '')}
                                    </Link>
                                ) : (
                                    <span className="text-purple-500 font-bold">
                                        @{criador.toLowerCase().replace(/\s/g, '')}
                                    </span>
                                )}
                                {qtdContribuidores > 0 && (
                                    <>
                                        {' e '}
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-purple-500 font-bold hover:underline transition-all cursor-pointer"
                                        >
                                            +{qtdContribuidores} outros
                                        </button>
                                    </>
                                )}{' '}
                                em {dataCriacao} — Downloads: 543
                            </p>
                        </div>

                        <div className="w-full">
                            <hr className="border-zinc-800/60" />

                            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between py-4 gap-6">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-4 flex-1">
                                    {manual?.game && (
                                        <SimpleInfoItem
                                            icon={<Dices className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Jogo:"
                                            value={manual.game}
                                        />
                                    )}
                                    {manual?.genero && (
                                        <SimpleInfoItem
                                            icon={<Swords className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Genero:"
                                            value={manual.genero}
                                        />
                                    )}
                                    {manual?.tipo && (
                                        <SimpleInfoItem
                                            icon={<Dice6 className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Tipo:"
                                            value={manual.tipo}
                                        />
                                    )}
                                    {manual?.edicao && (
                                        <SimpleInfoItem
                                            icon={
                                                <Calendar className="w-[1.125rem] h-[1.125rem]" />
                                            }
                                            text="Edição:"
                                            value={manual.edicao}
                                        />
                                    )}
                                    {manual?.idade && (
                                        <SimpleInfoItem
                                            icon={<Info className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Idade:"
                                            value={manual.idade}
                                        />
                                    )}
                                    {manual?.sistema && (
                                        <SimpleInfoItem
                                            icon={<Cpu className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Sistema:"
                                            value={manual.sistema}
                                        />
                                    )}
                                    {manual?.tempoJogo && (
                                        <SimpleInfoItem
                                            icon={<Clock className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Tempo de jogo:"
                                            value={`${manual.tempoJogo} min`}
                                        />
                                    )}
                                    {(manual?.minPlayers || manual?.maxPlayers) && (
                                        <SimpleInfoItem
                                            icon={<Users className="w-[1.125rem] h-[1.125rem]" />}
                                            text="Quantidade jogadores:"
                                            value={`${manual?.minPlayers}-${manual?.maxPlayers}`}
                                        />
                                    )}
                                </div>

                                <div className="flex gap-2.5 shrink-0 mt-2 lg:mt-0">
                                    <button className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer">
                                        <Eye className="w-[1.25rem] h-[1.25rem]" />
                                    </button>

                                    <button className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer">
                                        <SquareStack className="w-[1.25rem] h-[1.25rem]" />
                                    </button>

                                    <button className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer">
                                        <Download className="w-[1.25rem] h-[1.25rem]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-6 md:mt-6 mb-24 px-4">
                    <h1 className="text-text text-lg md:text-xl font-bold mb-4">Sobre o jogo</h1>

                    <p className="text-sub-text leading-relaxed text-sm md:text-base opacity-90">
                        {manual?.descricao || 'Este manual não possui uma descrição detalhada.'}
                    </p>
                </div>
            </div>

            <ContributorsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contributors={contribuidores}
            />
        </div>
    );
}

function SimpleInfoItem({ icon, value, text }: { icon: any; value: any; text?: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-purple-500">{icon}</div>
            <span className="text-purple-500 text-sm font-medium">{text}</span>
            <span className="text-zinc-200 font-medium text-sm">{value || '-'}</span>
        </div>
    );
}
