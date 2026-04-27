import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createManualService, updateManualService, getManualById } from '../services/createService';
import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';

export interface Contributor {
    id: string;
    name: string;
    email: string;
}

export interface CreateManualData {
    title: string;
    game: string;
    genre: string;
    system: string;
    banner: File | string | null;
    logo: File | string | null;
    playtime: number | '';
    type: string;
    edition: string;
    minPlayers: number | '';
    maxPlayers: number | '';
    ageRating: string;
    description: string;
    contributors: Contributor[];
}

export function useManualForm(editId?: string | null) {
    const { user } = useSession();
    const router = useRouter();

    const [data, setData] = useState<CreateManualData>({
        title: '',
        game: '',
        genre: '',
        system: '',
        banner: null,
        logo: null,
        playtime: '',
        type: '',
        edition: '',
        minPlayers: '',
        maxPlayers: '',
        ageRating: '',
        description: '',
        contributors: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!editId;

    // Buscar dados no modo edição
    useEffect(() => {
        if (isEditing && editId && user?.idPublico) {
            setIsLoading(true);
            getManualById(editId)
                .then(async (res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then((fetchedData) => {
                    if (fetchedData.user?.idPublico !== user.idPublico) {
                        router.push('/404');
                    } else {
                        const getImageUrl = (imgName: string | null) => {
                            if (!imgName) return null;
                            if (imgName.startsWith('http') || imgName.startsWith('/')) {
                                return imgName;
                            }
                            return `/upload/manual/${user.idPublico}/img/${imgName}`;
                        };

                        setData((prev) => ({
                            ...prev,
                            title: fetchedData.name || '',
                            game: fetchedData.game || '',
                            genre: fetchedData.genero || '',
                            system: fetchedData.sistema || '',
                            banner: getImageUrl(fetchedData.imgBanner),
                            logo: getImageUrl(fetchedData.imgLogo),

                            playtime: fetchedData.playtime.toString() || '',
                            type: fetchedData.type || '',
                            edition: fetchedData.edition || '',
                            minPlayers: fetchedData.minPlayers?.toString() || '',
                            maxPlayers: fetchedData.maxPlayers?.toString() || '',
                            ageRating: fetchedData.ageRating || '',
                            description: fetchedData.description || '',
                            contributors: fetchedData.contributors || [],
                        }));
                    }
                })
                .catch(() => router.push('/404'))
                .finally(() => setIsLoading(false));
        }
    }, [editId, isEditing, user?.idPublico, router]);

    const isValid = useMemo(() => {
        return (
            data.title.trim() !== '' &&
            data.game.trim() !== '' &&
            data.type.trim() !== '' &&
            data.edition.trim() !== '' &&
            data.ageRating.trim() !== '' &&
            data.description.trim() !== '' &&
            data.minPlayers !== '' &&
            data.maxPlayers !== '' &&
            data.playtime !== '' &&
            data.maxPlayers >= data.minPlayers
        );
    }, [data]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('game', data.game);
            formData.append('type', data.type);
            formData.append('edition', data.edition);
            formData.append('ageRating', data.ageRating);
            formData.append('description', data.description);
            formData.append('playtime', String(data.playtime));
            formData.append('minPlayers', String(data.minPlayers));
            formData.append('maxPlayers', String(data.maxPlayers));

            const contributorIds = data.contributors.map((c) => c.id);
            formData.append('contributors', JSON.stringify(contributorIds));

            if (data.genre) formData.append('genre', data.genre);
            if (data.system) formData.append('system', data.system);
            if (data.banner && data.banner instanceof File) formData.append('banner', data.banner);
            if (data.logo && data.logo instanceof File) formData.append('logo', data.logo);

            let response;
            if (isEditing && editId) {
                response = await updateManualService(editId, formData);
            } else {
                response = await createManualService(formData);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Erro ao salvar o manual');
            }

            customAlert.success(
                'Sucesso!',
                isEditing ? 'Seu manual foi atualizado.' : 'Seu manual foi criado.',
            );

            if (!isEditing) {
                setData({
                    title: '',
                    game: '',
                    genre: '',
                    system: '',
                    banner: null,
                    logo: null,
                    playtime: '',
                    type: '',
                    edition: '',
                    minPlayers: '',
                    maxPlayers: '',
                    ageRating: '',
                    description: '',
                    contributors: [],
                });
            }

            return await response.json();
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        setData,
        isValid,
        handleSubmit,
        isLoading,
        error,
    };
}
