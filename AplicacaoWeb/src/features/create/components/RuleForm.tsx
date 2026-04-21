import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Bookmark, Send, ShieldCheck, Home } from 'lucide-react';
import { CustomInput } from '../../../components/CustomInput';
import Select from 'react-select';

import { customStyles } from './selectStyles';
import { customAlert } from '../../../components/customAlert';

const EditorCompat = dynamic(() => import('./TextEditor'), { ssr: false });

export function RuleForm({
    data,
    setData,
    isValid,
    handleSubmit,
    isLoading,
    isFetchingInitialData,
    isEditing,
    manuals,
    handleImageAdded,
}: any) {
    const handleEditorChange = useCallback(
        (val: string) => {
            setData((prev: any) => ({ ...prev, content: val || '' }));
        },
        [setData],
    );

    const onActionClick = (status: 'PRIVADO' | 'PUBLICADO') => {
        if (!isValid) {
            customAlert.warning(
                'Atenção',
                'Preencha todos os campos obrigatórios antes de prosseguir.',
            );
            return;
        }

        handleSubmit(status);
    };

    if (!data) return null;

    return (
        <div className="flex flex-col gap-6" data-color-mode="dark">
            <CustomInput
                id="rule-title"
                label="Título da regra *"
                placeholder="Ex: Movimentação em combate"
                value={data.title}
                onChange={(e: any) => setData({ ...data, title: e.target.value })}
            />

            <div className="text-left">
                <label className="mb-2 ml-1 block text-sm font-medium text-sub-text">
                    Tipo de regra *
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div
                        onClick={() => setData({ ...data, type: 'oficial' })}
                        className={`group flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
                            data.type === 'oficial'
                                ? 'border-primary bg-primary/5'
                                : 'border-card-border bg-card hover:border-primary/50'
                        }`}
                    >
                        <div
                            className={`rounded-xl p-3 transition-colors ${
                                data.type === 'oficial'
                                    ? 'bg-primary text-white'
                                    : 'bg-card-border text-sub-text'
                            }`}
                        >
                            <ShieldCheck size={24} />
                        </div>

                        <div className="flex flex-1 flex-col text-left">
                            <span
                                className={`text-sm font-bold transition-colors ${
                                    data.type === 'oficial' ? 'text-white' : 'text-sub-text'
                                }`}
                            >
                                Regra Oficial
                            </span>

                            <span className="mt-1 text-xs leading-relaxed text-sub-text/80">
                                Conteúdo proveniente de manuais e livros oficiais.
                            </span>
                        </div>

                        <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                                data.type === 'oficial'
                                    ? 'border-primary bg-primary'
                                    : 'border-card-border bg-background'
                            }`}
                        />
                    </div>

                    <div
                        onClick={() => setData({ ...data, type: 'da_casa' })}
                        className={`group flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
                            data.type === 'da_casa'
                                ? 'border-primary bg-primary/5'
                                : 'border-card-border bg-card hover:border-primary/50'
                        }`}
                    >
                        <div
                            className={`rounded-xl p-3 transition-colors ${
                                data.type === 'da_casa'
                                    ? 'bg-primary text-white'
                                    : 'bg-card-border text-sub-text'
                            }`}
                        >
                            <Home size={24} />
                        </div>

                        <div className="flex flex-1 flex-col text-left">
                            <span
                                className={`text-sm font-bold transition-colors ${
                                    data.type === 'da_casa' ? 'text-white' : 'text-sub-text'
                                }`}
                            >
                                Regra da Casa
                            </span>

                            <span className="mt-1 text-xs leading-relaxed text-sub-text/80">
                                Regras customizadas, adaptações ou mecânicas criadas.
                            </span>
                        </div>

                        <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                                data.type === 'da_casa'
                                    ? 'border-primary bg-primary'
                                    : 'border-card-border bg-background'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <div className="text-left">
                <label className="mb-2 ml-1 block text-sm font-medium text-sub-text">
                    Manual *
                </label>

                <div className="max-w-xs">
                    <Select
                        options={manuals}
                        styles={customStyles}
                        placeholder="Selecione um manual"
                        value={manuals.find((opt: any) => opt.value === data.manualId) || null}
                        onChange={(selected: any) =>
                            setData({ ...data, manualId: selected?.value || '' })
                        }
                        noOptionsMessage={() => 'Nenhum manual encontrado'}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-medium text-sub-text">Conteúdo</label>

                <div className="overflow-hidden rounded-xl border border-card-border bg-background">
                    {isFetchingInitialData ? (
                        <div className="flex h-80 w-full flex-col items-center justify-center gap-3 text-sub-text">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <span className="text-sm font-medium">Carregando conteúdo...</span>
                        </div>
                    ) : (
                        <EditorCompat
                            markdown={data.content || ''}
                            onChange={handleEditorChange}
                            onImageAdded={handleImageAdded}
                        />
                    )}
                </div>
            </div>

            <div className="mt-2 flex justify-end gap-4">
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onActionClick('PRIVADO')}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-card-border bg-card px-5 py-2 text-sm font-bold transition-all hover:bg-card-border disabled:opacity-50"
                >
                    <Bookmark className="h-4 w-4" />
                    {isEditing ? 'Salvar alterações' : 'Salvar regra'}
                </button>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onActionClick('PUBLICADO')}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary-hover disabled:opacity-50"
                >
                    {isEditing ? 'Atualizar regra' : 'Postar regra'}
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
