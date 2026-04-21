import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createManualService, updateManualService, getManualById } from '../services/createService';
import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';

export interface CreateManualData {
    title: string;
    game: string;
    genre: string;
    system: string;
    banner: File | string | null;
    logo: File | string | null;
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
                            title: fetchedData.name,
                            game: fetchedData.game,
                            genre: fetchedData.genero || '',
                            system: fetchedData.sistema || '',
                            banner: getImageUrl(fetchedData.imgBanner),
                            logo: getImageUrl(fetchedData.imgLogo),
                        }));
                    }
                })
                .catch(() => router.push('/404'))
                .finally(() => setIsLoading(false));
        }
    }, [editId, isEditing, user?.idPublico, router]);

    const isValid = useMemo(() => {
        return data.title.trim() !== '' && data.game.trim() !== '';
    }, [data]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('game', data.game);

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
