import { CustomInput } from '../../../components/CustomInput';
import { ImagePlus, CirclePlus, Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

export function ManualForm({ data, setData, isValid, handleSubmit, isLoading, error }: any) {
    if (!data) return <p>Carregando formulário...</p>;

    const handleFile = (field: string, file: File | null) => {
        setData({ ...data, [field]: file });
    };

    const onSubmit = async () => {
        try {
            await handleSubmit();
            alert('Manual criado com sucesso!');
        } catch (err) {
            console.error('Falha ao criar', err);
        }
    };

    return (
        <div className="flex flex-col gap-[1.5rem]">
            <CustomInput
                id="m-title"
                label="Título do Manual *"
                placeholder="Ex: Guia de Campanha"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
            />

            <CustomInput
                id="m-game"
                label="Jogo *"
                placeholder="Ex: Dungeons & Dragons 5e"
                value={data.game}
                onChange={(e) => setData({ ...data, game: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.25rem]">
                <CustomInput
                    id="m-genre"
                    label="Gênero *"
                    placeholder="Ex: Fantasia Medieval"
                    value={data.genre}
                    onChange={(e) => setData({ ...data, genre: e.target.value })}
                />
                <CustomInput
                    id="m-system"
                    label="Sistema"
                    placeholder="Ex: d20"
                    value={data.system}
                    onChange={(e) => setData({ ...data, system: e.target.value })}
                />
            </div>

            <ImageUpload
                label="Banner do Manual"
                icon={<ImagePlus size={24} />}
                onSelect={(f) => handleFile('banner', f)}
                preview={data.banner ? URL.createObjectURL(data.banner) : null}
                className="w-full h-[14rem]"
            />

            <ImageUpload
                label="Logo do Manual"
                icon={<ImagePlus size={24} />}
                onSelect={(f) => handleFile('logo', f)}
                preview={data.logo ? URL.createObjectURL(data.logo) : null}
                className="w-[8rem] h-[8rem]"
                centerField
            />

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <div className="flex justify-end gap-[1rem] mt-[0.5rem]">
                <button
                    disabled={!isValid || isLoading}
                    onClick={onSubmit}
                    className="flex items-center gap-2 bg-primary py-[0.5rem] px-[1.25rem] text-sm rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-all text-white"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CirclePlus className="w-4 h-4" />
                    )}
                    {isLoading ? 'Criando...' : 'Criar manual'}
                </button>
            </div>
        </div>
    );
}
