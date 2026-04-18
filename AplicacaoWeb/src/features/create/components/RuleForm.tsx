import dynamic from 'next/dynamic';
import { Bookmark, Send } from 'lucide-react';
import { CustomInput } from '../../../components/CustomInput';
import Select from 'react-select';
import '@mdxeditor/editor/style.css';

import { customStyles } from './selectStyles';

const EditorCompat = dynamic(() => import('./MDXEditorWrapper'), { ssr: false });

const manualOptions = [
    {
        value: '1',
        label: 'Manual do Jogador (D&D 5e)',
    },
    {
        value: '2',
        label: 'Manual do Jogador (D&D 5e)2',
    },
];

export function RuleForm({ data, setData, isValid }: any) {
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
                <label className="mb-[0.5rem] block text-[0.875rem] font-medium ml-[0.26rem] text-sub-text">
                    Manual *
                </label>

                <div className="max-w-[18rem]">
                    <Select
                        options={manualOptions}
                        styles={customStyles}
                        placeholder="Selecione um manual"
                        value={manualOptions.find((opt) => opt.value === data.manualId) || null}
                        onChange={(selected: any) =>
                            setData({ ...data, manualId: selected ? selected.value : '' })
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
                        markdown={data.content}
                        onChange={(val: string) => setData({ ...data, content: val || '' })}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-[1rem] mt-[0.5rem]">
                <button
                    type="button"
                    className="flex items-center gap-2 bg-card border border-card-border py-[0.5rem] px-[1.25rem] text-sm rounded-xl font-bold hover:bg-card-border transition-all cursor-pointer"
                >
                    <Bookmark className="w-4 h-4" />
                    Salvar regra
                </button>
                <button
                    type="submit"
                    disabled={!isValid}
                    className="flex items-center gap-2 bg-primary py-[0.5rem] px-[1.25rem] text-sm rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-all text-white cursor-pointer"
                >
                    Postar regra
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
