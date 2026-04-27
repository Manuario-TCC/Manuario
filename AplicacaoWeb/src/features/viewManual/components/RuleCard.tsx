'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import MarkdownViewer from '@/src/components/MarkdownViewer';
import { useSession } from '@/src/hooks/useSession';

interface Regra {
    idPublic: string;
    name: string;
    description: string;
    userId: string;
}

interface RuleCardProps {
    regra?: Regra;
    loading?: boolean;
}

export function RuleCard({ regra, loading }: RuleCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useSession();

    if (loading) {
        return (
            <div className="bg-transparent border border-gray/80 rounded-lg p-4 h-[3.75rem] animate-pulse flex items-center justify-between">
                <div className="h-4 bg-gray rounded w-1/3" />
                <div className="h-6 bg-gray rounded-full w-6" />
            </div>
        );
    }

    // 2. SEGURANÇA: Se não estiver carregando mas a regra vier vazia, não renderiza nada
    if (!regra) return null;

    // 3. LÓGICA DA REGRA: Só agora, com a certeza de que a regra existe, fazemos a verificação
    const isOwner = user?.idPublico === regra.userId;

    return (
        <div className="bg-card rounded-lg overflow-hidden transition-all">
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-card"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-text font-medium flex-1">{regra.name}</h3>

                <div className="flex items-center gap-2">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex items-center"
                    >
                        {isOwner ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 hover:bg-gray rounded-full text-sub-text hover:text-text"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-gray border border-gray rounded-md shadow-lg z-10 py-1">
                                        <Link
                                            href={`/post/regra/${regra.idPublic}`}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-sub-text hover:bg-gray hover:text-text"
                                        >
                                            <Eye size={16} /> Ver post
                                        </Link>
                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-sub-text hover:bg-gray hover:text-text text-left">
                                            <Edit size={16} /> Editar
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left">
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href={`/post/regra/${regra.idPublic}`}
                                className="p-2 hover:bg-gray rounded-full text-sub-text hover:text-text transition-colors"
                                title="Ver Post"
                            >
                                <Eye size={18} />
                            </Link>
                        )}
                    </div>

                    <div className="p-1 text-sub-text">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="p-8 bg-card">
                    <MarkdownViewer content={regra.description} />
                </div>
            )}
        </div>
    );
}
