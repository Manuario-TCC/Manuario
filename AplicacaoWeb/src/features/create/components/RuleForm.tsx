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
        <div className="flex flex-col gap-[1.5rem]" data-color-mode="dark">
            <CustomInput
                id="rule-title"
                label="Título da regra *"
                placeholder="Ex: Movimentação em combate"
                value={data.title}
                onChange={(e: any) => setData({ ...data, title: e.target.value })}
            />

            <div className="text-left">
                <label className="mb-[0.5rem] block text-[0.875rem] font-medium ml-[0.25rem] text-sub-text">
                    Tipo de regra *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => setData({ ...data, type: 'oficial' })}
                        className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            data.type === 'oficial'
                                ? 'border-primary bg-primary/5'
                                : 'border-card-border bg-card hover:border-primary/50'
                        }`}
                    >
                        <div
                            className={`p-3 rounded-xl transition-colors ${
                                data.type === 'oficial'
                                    ? 'bg-primary text-white'
                                    : 'bg-card-border text-sub-text'
                            }`}
                        >
                            <ShieldCheck size={24} />
                        </div>

                        <div className="flex flex-col text-left flex-1">
                            <span
                                className={`text-sm font-bold transition-colors ${
                                    data.type === 'oficial' ? 'text-white' : 'text-sub-text'
                                }`}
                            >
                                Regra Oficial
                            </span>

                            <span className="text-[0.75rem] leading-relaxed text-sub-text/80 mt-1">
                                Conteúdo proveniente de manuais e livros oficiais.
                            </span>
                        </div>

                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                data.type === 'oficial'
                                    ? 'border-primary bg-primary'
                                    : 'border-card-border bg-background'
                            }`}
                        ></div>
                    </div>

                    <div
                        onClick={() => setData({ ...data, type: 'da_casa' })}
                        className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            data.type === 'da_casa'
                                ? 'border-primary bg-primary/5'
                                : 'border-card-border bg-card hover:border-primary/50'
                        }`}
                    >
                        <div
                            className={`p-3 rounded-xl transition-colors ${
                                data.type === 'da_casa'
                                    ? 'bg-primary text-white'
                                    : 'bg-card-border text-sub-text'
                            }`}
                        >
                            <Home size={24} />
                        </div>

                        <div className="flex flex-col text-left flex-1">
                            <span
                                className={`text-sm font-bold transition-colors ${
                                    data.type === 'da_casa' ? 'text-white' : 'text-sub-text'
                                }`}
                            >
                                Regra da Casa
                            </span>
                            <span className="text-[0.75rem] leading-relaxed text-sub-text/80 mt-1">
                                Regras customizadas, adaptações ou mecânicas criadas.
                            </span>
                        </div>

                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                data.type === 'da_casa'
                                    ? 'border-primary bg-primary'
                                    : 'border-card-border bg-background'
                            }`}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="text-left">
                <label className="mb-[0.5rem] block text-[0.875rem] font-medium ml-[0.25rem] text-sub-text">
                    Manual *
                </label>

                <div className="max-w-[18rem]">
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

            <div className="flex flex-col gap-[0.5rem]">
                <label className="text-[0.875rem] font-medium ml-[0.25rem] text-sub-text">
                    Conteúdo
                </label>
                <div className="border border-card-border rounded-xl overflow-hidden bg-background">
                    <EditorCompat
                        markdown={data.content || ''}
                        onChange={handleEditorChange}
                        onImageAdded={handleImageAdded}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-[1rem] mt-[0.5rem]">
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onActionClick('PRIVADO')}
                    className="flex items-center gap-2 bg-card border border-card-border py-[0.5rem] px-[1.25rem] text-sm rounded-xl font-bold hover:bg-card-border transition-all cursor-pointer disabled:opacity-50"
                >
                    <Bookmark className="w-4 h-4" />
                    Salvar regra
                </button>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onActionClick('PUBLICADO')}
                    className="flex items-center gap-2 bg-primary py-[0.5rem] px-[1.25rem] text-sm rounded-xl font-bold hover:bg-primary-hover transition-all text-white cursor-pointer disabled:opacity-50"
                >
                    Postar regra
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
