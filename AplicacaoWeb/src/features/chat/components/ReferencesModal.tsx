import { X, ExternalLink, BookOpen, HelpCircle } from 'lucide-react';
import { AIReference } from '../services/assistantService';
import Link from 'next/link';

interface ReferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    references: AIReference[];
}

export default function ReferencesModal({ isOpen, onClose, references }: ReferencesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-md rounded-3xl shadow-2xl border border-card-border flex flex-col max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-card-border shrink-0 bg-background">
                    <h2 className="font-bold text-lg text-text">Fontes da Comunidade</h2>

                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-card rounded-full transition-all text-sub-text hover:text-text cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex flex-col gap-3">
                    <p className="text-sm text-sub-text mb-2">
                        A IA baseou esta resposta nos seguintes tópicos:
                    </p>

                    {references.map((ref, idx) => (
                        <Link
                            key={idx}
                            href={`/post/${ref.type}/${ref.idPublic}`}
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-xl border border-card-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="p-2 bg-background rounded-lg text-text">
                                {ref.type === 'duvida' ? (
                                    <HelpCircle size={18} />
                                ) : (
                                    <BookOpen size={18} />
                                )}
                            </div>

                            <div className="flex-1 flex flex-col min-w-0">
                                <span className="text-xs text-sub-text uppercase tracking-wider font-semibold">
                                    {ref.type}
                                </span>

                                <span className="text-sm font-medium text-text truncate">
                                    {ref.title}
                                </span>
                            </div>

                            <ExternalLink
                                size={16}
                                className="text-sub-text group-hover:text-primary shrink-0"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
