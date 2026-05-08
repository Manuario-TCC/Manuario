import { X, Loader2 } from 'lucide-react';
import { useSession } from '../../../hooks/useSession';
import { usePublishAI } from '../hooks/usePublishAI';
import ChatMarkdown from './ChatMarkdown';
import { CustomInput } from '../../../components/CustomInput';

interface PublishAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    promptUser: string;
    aiResponse: string;
    initialTitle: string;
    initialGameName: string;
}

export default function PublishAIModal({
    isOpen,
    onClose,
    promptUser,
    aiResponse,
    initialTitle,
    initialGameName,
}: PublishAIModalProps) {
    const { user } = useSession();
    const { title, setTitle, gameName, setGameName, isSubmitting, handlePublish } = usePublishAI({
        initialTitle,
        initialGameName,
        promptUser,
        aiResponse,
        idPublicUser: user?.idPublic,
        onSuccess: onClose,
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-2xl rounded-3xl shadow-2xl border border-card-border flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-card-border shrink-0 bg-background">
                    <h2 className="font-bold text-xl text-text">Publicar no Manuário</h2>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-card rounded-full transition-all text-sub-text hover:text-text cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    <div className="flex flex-col gap-8">
                        <CustomInput
                            id="p-title"
                            label="Título *"
                            placeholder="Ex: Regra de combate"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                        />

                        <CustomInput
                            id="p-gameName"
                            label="Nome do Jogo *"
                            placeholder="Ex: Magic: The Gathering"
                            value={gameName}
                            onChange={(e: any) => setGameName(e.target.value)}
                        />
                    </div>

                    <div className="rounded-3xl p-6 border border-card-border space-y-8 shadow-sm">
                        <div className="flex w-full justify-end">
                            <div className="flex max-w-[85%] gap-3 flex-row-reverse text-right">
                                <img
                                    src={user?.img || '/default-avatar.png'}
                                    className="w-10 h-10 rounded-full shrink-0 object-cover shadow-sm"
                                    alt="User Avatar"
                                />

                                <div className="relative">
                                    <div className="absolute top-0 -right-[7px] text-card w-2.5 h-3.5">
                                        <svg viewBox="0 0 8 13" className="fill-current">
                                            <path d="M0 0v13L8 0z" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10 px-5 py-3.5 bg-card rounded-2xl rounded-tr-none shadow-sm text-sm text-text">
                                        {promptUser}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full justify-start">
                            <div className="flex max-w-[85%] gap-3 flex-row">
                                <img
                                    src="/img/iconePadrao.jpg"
                                    className="w-10 h-10 rounded-full shrink-0 object-cover shadow-sm"
                                    alt="AI Avatar"
                                />
                                <div className="relative">
                                    <div className="absolute top-0 -left-[0.45rem] text-card w-2.5 h-3.5">
                                        <svg viewBox="0 0 8 13" className="fill-current">
                                            <path d="M8 0v13L0 0z" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10 px-5 py-3.5 bg-card rounded-2xl rounded-tl-none shadow-sm text-sm text-text">
                                        <ChatMarkdown content={aiResponse} isTyping={false} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 font-medium hover:bg-card rounded-xl text-sub-text transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting || !title.trim()}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />} Publicar
                            Agora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
