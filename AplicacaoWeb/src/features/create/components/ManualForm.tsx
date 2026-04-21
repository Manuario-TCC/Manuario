import { CustomInput } from '../../../components/CustomInput';
import { ImagePlus, CirclePlus, Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { customAlert } from '../../../components/customAlert';

export function ManualForm({ data, setData, isValid, handleSubmit, isLoading, error }: any) {
    if (!data) return <p>Carregando formulário...</p>;

    const handleFile = (field: string, file: File | null) => {
        setData({ ...data, [field]: file });
    };

    const onSubmit = async () => {
        try {
            await handleSubmit();
            customAlert.success('Manual criado com sucesso!');
        } catch (err) {
            console.error('Falha ao criar', err);
        }
    };

    return (
        <div className="flex flex-col gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                preview={
                    data.banner
                        ? data.banner instanceof File
                            ? URL.createObjectURL(data.banner)
                            : data.banner
                        : null
                }
                className="w-full h-56"
            />

            <ImageUpload
                label="Logo do Manual"
                icon={<ImagePlus size={24} />}
                onSelect={(f) => handleFile('logo', f)}
                preview={
                    data.logo
                        ? data.logo instanceof File
                            ? URL.createObjectURL(data.logo)
                            : data.logo
                        : null
                }
                className="w-32 h-32"
                centerField
            />

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <div className="flex justify-end gap-4 mt-2">
                <button
                    disabled={!isValid || isLoading}
                    onClick={onSubmit}
                    className="flex items-center gap-2 bg-primary py-2 px-5 text-sm rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-all text-white"
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
