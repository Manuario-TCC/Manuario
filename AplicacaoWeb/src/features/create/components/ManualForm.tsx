import React from 'react';
import Select from 'react-select';
import { CustomInput } from '../../../components/CustomInput';
import { ImageUpload } from './ImageUpload';
import { NumberStepper } from './NumberStepper';
import { ContributorSelect } from './ContributorSelect';
import { customStyles } from './selectStyles';
import { ImagePlus, CirclePlus, Loader2 } from 'lucide-react';

export function ManualForm({
    data,
    setData,
    isValid,
    handleSubmit,
    isLoading,
    error,
    isEditing,
}: any) {
    if (!data) return <p className="text-muted-foreground">Carregando formulário...</p>;

    const handleFile = (field: string, file: File | null) => {
        setData({ ...data, [field]: file });
    };

    const onSubmit = async () => {
        try {
            await handleSubmit();
        } catch (err) {
            console.error('Falha ao criar', err);
        }
    };

    const ageOptions = [
        { value: 'Livre', label: 'Livre' },
        { value: '10', label: '10 anos' },
        { value: '12', label: '12 anos' },
        { value: '14', label: '14 anos' },
        { value: '16', label: '16 anos' },
        { value: '18', label: '18 anos' },
    ];

    const inputBaseClass =
        'w-full rounded-2xl bg-transparent border border-card-border px-4 text-sm outline-none focus:border-primary/50 transition-all text-foreground';

    return (
        <div className="flex flex-col gap-6">
            <CustomInput
                id="m-title"
                label="Título do Manual *"
                placeholder="Ex: Guia de Campanha"
                value={data.title}
                onChange={(e: any) => setData({ ...data, title: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CustomInput
                    id="m-game"
                    label="Jogo *"
                    placeholder="Ex: Dungeons & Dragons 5e"
                    value={data.game}
                    onChange={(e: any) => setData({ ...data, game: e.target.value })}
                />
                <CustomInput
                    id="m-type"
                    label="Tipo *"
                    placeholder="Ex: Livro Base, Suplemento, Aventura"
                    value={data.type}
                    onChange={(e: any) => setData({ ...data, type: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CustomInput
                    id="m-edition"
                    label="Edição *"
                    placeholder="Ex: 5ª Edição"
                    value={data.edition}
                    onChange={(e: any) => setData({ ...data, edition: e.target.value })}
                />
                <CustomInput
                    id="m-genre"
                    label="Gênero"
                    placeholder="Ex: Fantasia Medieval"
                    value={data.genre}
                    onChange={(e: any) => setData({ ...data, genre: e.target.value })}
                />

                <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold text-sub-text pl-1 mb-2">
                        Classificação *
                    </label>
                    <Select
                        styles={customStyles}
                        options={ageOptions}
                        placeholder="Selecione..."
                        value={ageOptions.find((opt) => opt.value === data.ageRating)}
                        onChange={(opt: any) => setData({ ...data, ageRating: opt.value })}
                        isSearchable={false}
                    />
                </div>

                <CustomInput
                    id="m-system"
                    label="Sistema"
                    placeholder="Ex: d20"
                    value={data.system}
                    onChange={(e: any) => setData({ ...data, system: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
                <NumberStepper
                    label="Tempo de jogo (Min)*"
                    placeholder="Ex: 120"
                    value={data.playtime}
                    maxLimit={9999}
                    onChange={(valStr: string) =>
                        setData({ ...data, playtime: valStr ? Number(valStr) : '' })
                    }
                />

                <NumberStepper
                    label="Mín. Jogadores *"
                    placeholder="Ex: 2"
                    value={data.minPlayers}
                    maxLimit={99}
                    isError={
                        data.minPlayers !== '' &&
                        data.maxPlayers !== '' &&
                        data.minPlayers > data.maxPlayers
                    }
                    onChange={(valStr: string) =>
                        setData({ ...data, minPlayers: valStr ? Number(valStr) : '' })
                    }
                />

                <NumberStepper
                    label="Máx. Jogadores *"
                    placeholder="Ex: 6"
                    value={data.maxPlayers}
                    maxLimit={99}
                    isError={
                        data.minPlayers !== '' &&
                        data.maxPlayers !== '' &&
                        data.minPlayers > data.maxPlayers
                    }
                    onChange={(valStr: string) =>
                        setData({ ...data, maxPlayers: valStr ? Number(valStr) : '' })
                    }
                />
            </div>

            <div className="flex flex-col w-full">
                <label className="text-sm font-semibold text-sub-text pl-1 mb-2">Descrição *</label>
                <textarea
                    rows={4}
                    placeholder="Descreva sobre o que é este manual..."
                    className={`${inputBaseClass} p-4 resize-none`}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                />
            </div>

            <ContributorSelect data={data} setData={setData} />

            <div className="grid grid-cols-1 gap-5">
                <ImageUpload
                    label="Banner do Manual"
                    icon={<ImagePlus size={24} />}
                    onSelect={(f) => handleFile('banner', f)}
                    preview={
                        data.banner instanceof File ? URL.createObjectURL(data.banner) : data.banner
                    }
                    className="w-full h-56 rounded-2xl border-card-border"
                />
                <ImageUpload
                    label="Logo do Manual"
                    icon={<ImagePlus size={24} />}
                    onSelect={(f) => handleFile('logo', f)}
                    preview={data.logo instanceof File ? URL.createObjectURL(data.logo) : data.logo}
                    className="w-32 h-32 rounded-2xl border-card-border"
                    centerField
                />
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <div className="flex justify-end mt-4">
                <button
                    disabled={!isValid || isLoading}
                    onClick={onSubmit}
                    className="flex items-center gap-2 bg-primary py-3 px-8 text-sm rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all text-white shadow-lg cursor-pointer"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <CirclePlus className="w-5 h-5" />
                    )}
                    {isLoading
                        ? isEditing
                            ? 'Salvando...'
                            : 'Criando...'
                        : isEditing
                          ? 'Editar manual'
                          : 'Criar manual'}
                </button>
            </div>
        </div>
    );
}
