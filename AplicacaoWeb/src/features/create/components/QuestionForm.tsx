import dynamic from 'next/dynamic';
import { Send, Trash2, Loader2, Pencil } from 'lucide-react';
import { CustomInput } from '../../../components/CustomInput';
import { customAlert } from '../../../components/customAlert';

const EditorCompat = dynamic(() => import('./TextEditor'), {
    ssr: false,
    loading: () => <div className="p-4 text-sub-text">Carregando editor...</div>,
});

export function QuestionForm({
    data,
    setData,
    isValid,
    handleSubmit,
    handleDelete,
    isLoading,
    isEditing,
    handleImageAdded,
}: any) {
    if (!data) return null;

    const onSubmitClick = () => {
        if (!isValid) {
            customAlert.warning(
                'Atenção',
                'Preencha todos os campos obrigatórios antes de postar.',
            );
            return;
        }
        handleSubmit();
    };

    return (
        <div className="flex flex-col gap-6">
            <CustomInput
                id="q-title"
                label="Título da dúvida *"
                placeholder="Titulo da sua dúvida"
                value={data.title}
                onChange={(e: any) => setData({ ...data, title: e.target.value })}
            />

            <CustomInput
                id="q-game"
                label="Jogo *"
                placeholder="Nome do jogo"
                value={data.game}
                onChange={(e: any) => setData({ ...data, game: e.target.value })}
            />

            <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-medium text-sub-text">Detalhes *</label>

                <div className="overflow-hidden rounded-xl border border-card-border bg-background">
                    <EditorCompat
                        markdown={data.description || ''}
                        onChange={(val: string) => setData({ ...data, description: val || '' })}
                        onImageAdded={handleImageAdded}
                    />
                </div>
            </div>

            <div className="mt-2 flex justify-end gap-4">
                {isEditing ? (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-5 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500 hover:text-text disabled:opacity-50 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                    </button>
                ) : (
                    <div />
                )}

                <button
                    type="button"
                    onClick={onSubmitClick}
                    disabled={isLoading}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isEditing ? (
                        <Pencil className="w-5 h-5" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}

                    {isLoading ? 'Carregando...' : isEditing ? 'Editar Dúvida' : 'Postar Dúvida'}
                </button>
            </div>
        </div>
    );
}
