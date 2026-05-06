import Link from 'next/link';
import Image from 'next/image';
import { Home, Crown, Dices, Swords } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center bg-[hsl(240_10%_4%)] text-white overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(275_85%_55%)] opacity-10 blur-[120px]" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative h-56 w-72 mb-10 flex items-center justify-center">
                    <div className="absolute w-64 h-40 bg-[hsl(275_85%_55%)] opacity-30 blur-[60px] rounded-full z-0 animate-pulse" />

                    <div className="absolute -translate-x-20 animate-float-1 z-10">
                        <div className="h-40 w-28 bg-card border border-[hsl(275_80%_60%/0.4)] rounded-xl -rotate-12 shadow-[0_0_25px_rgba(168,85,247,0.25)] flex flex-col items-center justify-between p-3">
                            <span className="self-start font-bold text-white text-lg">4</span>
                            <Crown size={32} className="text-[hsl(45_100%_70%)]" />
                            <span className="self-end font-bold text-white text-lg rotate-180">
                                4
                            </span>
                        </div>
                    </div>

                    <div className="absolute translate-x-20 animate-float-2 z-10">
                        <div className="h-40 w-28 bg-card border border-[hsl(275_80%_60%/0.4)] rounded-xl rotate-12 shadow-[0_0_25px_rgba(168,85,247,0.25)] flex flex-col items-center justify-between p-3">
                            <span className="self-start font-bold text-white text-lg">4</span>
                            <Swords size={32} className="text-[hsl(280_100%_80%)]" />
                            <span className="self-end font-bold text-white text-lg rotate-180">
                                4
                            </span>
                        </div>
                    </div>

                    <div className="absolute h-48 w-32 z-20 [perspective:1000px]">
                        <div className="relative w-full h-full animate-card-flip-continuous [transform-style:preserve-3d]">
                            <div className="absolute inset-0 bg-card border-2 border-[hsl(275_80%_60%/0.4)] rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col items-center justify-between p-3 [backface-visibility:hidden]">
                                <span className="self-start font-bold text-white text-xl">0</span>
                                <Dices size={40} className="text-[hsl(280_100%_80%)]" />
                                <span className="self-end font-bold text-white text-xl rotate-180">
                                    0
                                </span>
                            </div>

                            <div className="absolute inset-0 bg-card border-2 border-[hsl(275_80%_60%/0.4)] rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.5)] flex flex-col items-center justify-center p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-white flex items-center justify-center">
                                    <Image
                                        src="/img/iconePadrao.jpg"
                                        alt="Logo Manuario"
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4 px-6 z-30">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] [text-shadow:0_0_1px_rgba(168,85,247,0.8)]">
                        Esta página foi descartada do baralho
                    </h1>

                    <p className="text-[hsl(240_5%_70%)] text-base md:text-lg max-w-md mx-auto leading-relaxed mt-2">
                        Parece que o dado rolou para fora da mesa, essa página não está mais
                        disponível no momento.
                    </p>
                </div>

                <div className="mt-10">
                    <Link
                        href="/feed"
                        className="inline-flex items-center justify-center bg-[hsl(275_85%_55%)] text-white px-8 py-4 text-base font-bold rounded-2xl shadow-[0_10px_30px_-10px_hsl(275_95%_55%/0.8)] transition-all hover:scale-105 active:scale-95 z-30 relative"
                    >
                        <Home className="mr-2" size={18} />
                        Voltar para o feed
                    </Link>
                </div>
            </div>
        </main>
    );
}
