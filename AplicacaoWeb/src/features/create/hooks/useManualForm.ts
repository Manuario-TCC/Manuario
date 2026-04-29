import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createManualService,
    updateManualService,
    getManualById,
    deleteManualService,
} from '../services/manualService';
import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';

export interface Contributor {
    id: string;
    idPublic?: string;
    name: string;
    email: string;
    img?: string;
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
        if (isEditing && editId && user?.idPublic) {
            setIsLoading(true);
            getManualById(editId)
                .then(async (res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then((fetchedData) => {
                    // Verifica se o usuário é o dono do manual
                    if (fetchedData.user?.idPublic !== user.idPublic) {
                        router.push('/404');
                    } else {
                        const getImageUrl = (imgName: string | null) => {
                            if (!imgName) return null;
                            if (imgName.startsWith('http') || imgName.startsWith('/')) {
                                return imgName;
                            }
                            return `/upload/manual/${fetchedData.idPublic}/img/${imgName}`;
                        };

                        setData((prev) => ({
                            ...prev,
                            title: fetchedData.name || '',
                            game: fetchedData.game || '',
                            genre: fetchedData.genre || '',
                            system: fetchedData.system || '',
                            banner: getImageUrl(fetchedData.imgBanner),
                            logo: getImageUrl(fetchedData.imgLogo),
                            playtime: fetchedData.playTime || '',
                            type: fetchedData.type || '',
                            edition: fetchedData.edition || '',
                            minPlayers: fetchedData.minPlayers || '',
                            maxPlayers: fetchedData.maxPlayers || '',
                            ageRating: fetchedData.ageRange || '',
                            description: fetchedData.description || '',

                            contributors: fetchedData.contributors
                                ? fetchedData.contributors.map((c: any) => ({
                                      id: c.id,
                                      idPublic: c.idPublic,
                                      name: c.name,
                                      email: c.email,
                                      img: c.img,
                                  }))
                                : [],
                        }));
                    }
                })
                .catch(() => router.push('/404'))
                .finally(() => setIsLoading(false));
        }
    }, [editId, isEditing, user?.idPublic, router]);

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

            if (data.genre) {
                formData.append('genre', data.genre);
            }

            if (data.system) {
                formData.append('system', data.system);
            }

            if (data.banner && data.banner instanceof File) {
                formData.append('banner', data.banner);
            }

            if (data.logo && data.logo instanceof File) {
                formData.append('logo', data.logo);
            }

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

            const responseData = await response.json();

            await customAlert.toastSuccess(
                isEditing ? 'Seu manual foi atualizado.' : 'Seu manual foi criado.',
            );

            const redirectId = isEditing ? editId : responseData.manual.idPublic;
            router.push(`/manual/${redirectId}`);

            return responseData;
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editId) return;

        const confirm = await customAlert.confirmDelete(
            'Excluir Manual?',
            'Tem certeza que deseja excluir este manual?',
        );

        if (confirm.isConfirmed) {
            setIsLoading(true);
            try {
                await deleteManualService(editId);
                await customAlert.toastSuccess('Manual excluído com sucesso!');
                router.push('/feed');
            } catch (error) {
                customAlert.toastError
                    ? await customAlert.toastError('Não foi possível excluir o manual.')
                    : customAlert.error('Erro', 'Não foi possível excluir o manual.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return {
        data,
        setData,
        isValid,
        handleSubmit,
        isLoading,
        error,
        isEditing,
        handleDelete,
    };
}
