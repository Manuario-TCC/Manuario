import dynamic from 'next/dynamic';
import { Send } from 'lucide-react';
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
    isLoading,
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
        <div className="flex flex-col gap-[1.5rem]">
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

            <div className="flex flex-col gap-[0.5rem]">
                <label className="text-[0.875rem] font-medium ml-[0.25rem] text-sub-text">
                    Detalhes *
                </label>

                <div className="border border-card-border rounded-xl overflow-hidden bg-background">
                    <EditorCompat
                        markdown={data.description || ''}
                        onChange={(val: string) => setData({ ...data, description: val || '' })}
                        onImageAdded={handleImageAdded}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-[1rem] mt-[0.5rem]">
                <button
                    type="button"
                    onClick={onSubmitClick}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary py-[0.5rem] px-[1.25rem] text-sm rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-all text-white cursor-pointer"
                >
                    <Send className="w-4 h-4" />
                    {isLoading ? 'Postando...' : 'Postar dúvida'}
                </button>
            </div>
        </div>
    );
}
