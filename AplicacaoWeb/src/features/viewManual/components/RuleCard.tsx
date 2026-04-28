'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import MarkdownViewer from '@/src/components/MarkdownViewer';
import { useSession } from '@/src/hooks/useSession';
import { useRuleActions } from '../hooks/useRuleActions';

interface Regra {
    id: string;
    idPublic: string;
    name: string;
    description: string;
    userId: string;
    originManualId?: string;
    user?: {
        idPublic: string;
    };
}

interface RuleCardProps {
    rules?: Regra;
    loading?: boolean;
    manualId?: string;
    manualUserId?: string;
}

export function RuleCard({ rules, loading, manualId, manualUserId }: RuleCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useSession();

    const isAutorDaRegra = Boolean(
        user?.idPublic && rules?.user?.idPublic && user.idPublic === rules.user.idPublic,
    );

    const isDonoDoManual = Boolean(
        user?.idPublic && manualUserId && user.idPublic === manualUserId,
    );

    const podeEditarOuDeletar = isAutorDaRegra || isDonoDoManual;

    const { handleEdit, handleDelete } = useRuleActions({
        manualId: manualId || '',
        isDonoDoManual,
        isAutorDaRegra,
    });

    if (loading) {
        return (
            <div className="bg-transparent border border-gray/80 rounded-lg p-4 h-[3.75rem] animate-pulse flex items-center justify-between">
                <div className="h-4 bg-gray rounded w-1/3" />
                <div className="h-6 bg-gray rounded-full w-6" />
            </div>
        );
    }

    if (!rules) return null;

    return (
        <div
            className={`bg-card rounded-lg transition-all relative ${isMenuOpen ? 'z-50' : 'z-10'}`}
        >
            <div
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-card relative ${isMenuOpen ? 'z-40' : 'z-auto'} ${!isOpen ? 'rounded-lg' : 'rounded-t-lg'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-col gap-0.5 flex-1">
                    <h3 className="text-text font-medium">{rules.name}</h3>
                    {rules.originManualId && (
                        <span className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">
                            Regra Clonada
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex items-center"
                    >
                        {podeEditarOuDeletar ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 hover:bg-gray rounded-full text-sub-text hover:text-text transition-colors"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-gray border border-gray rounded-md shadow-lg z-[100] py-1">
                                        <Link
                                            href={`/post/rules/${rules.idPublic}`}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-sub-text rounded-lg hover:bg-background hover:text-text transition-colors"
                                        >
                                            <Eye size={16} /> Ver post
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleEdit(rules);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-sub-text hover:bg-background hover:text-text text-left cursor-pointer transition-colors"
                                        >
                                            <Edit size={16} /> Editar
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleDelete(rules.id);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left cursor-pointer transition-colors"
                                        >
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href={`/post/rules/${rules.idPublic}`}
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
                <div className="p-8 bg-card border-t border-gray/20">
                    <MarkdownViewer content={rules.description} />
                </div>
            )}
        </div>
    );
}
