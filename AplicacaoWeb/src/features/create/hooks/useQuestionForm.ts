import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createDoubtService,
    updateDoubtService,
    getDoubtById,
    deleteQuestionService,
} from '../services/questionService';
import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';

export function useQuestionForm(editId?: string | null) {
    const { user } = useSession();
    const router = useRouter();

    const [data, setData] = useState({ title: '', game: '', description: '' });
    const [publicationId] = useState(() => crypto.randomUUID());
    const [isLoading, setIsLoading] = useState(false);
    const [pendingImages, setPendingImages] = useState<Record<string, File>>({});

    const isEditing = !!editId;

    useEffect(() => {
        if (isEditing && editId && user?.idPublic) {
            setIsLoading(true);

            getDoubtById(editId)
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error('Dúvida não encontrada');
                    }

                    return res.json();
                })
                .then((fetchedData) => {
                    const ownerPublicId = fetchedData.user?.idPublic;

                    if (ownerPublicId !== user.idPublic) {
                        router.push('/404');
                    } else {
                        setData({
                            title: fetchedData.name || fetchedData.title,
                            game: fetchedData.game,
                            description: fetchedData.description,
                        });
                    }
                })
                .catch(() => {
                    router.push('/404');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [editId, isEditing, user?.idPublic, router]);

    const isValid = useMemo(() => {
        return (
            data.title.trim() !== '' && data.game.trim() !== '' && data.description.trim() !== ''
        );
    }, [data]);

    const handleImageAdded = useCallback((file: File, tempUrl: string) => {
        setPendingImages((prev) => ({ ...prev, [tempUrl]: file }));
    }, []);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!isValid) {
            customAlert.warning('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }

        setIsLoading(true);
        try {
            let finalContent = data.description;

            // Processamento de imagens no Markdown
            for (const [tempUrl, file] of Object.entries(pendingImages)) {
                if (finalContent.includes(tempUrl)) {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('publicationId', publicationId);

                    const uploadRes = await fetch('/api/upload/md-duvida', {
                        method: 'POST',
                        body: formData,
                    });

                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        finalContent = finalContent.replaceAll(tempUrl, uploadData.url);
                    }
                }
            }

            const payload = {
                publicationId,
                title: data.title,
                game: data.game,
                description: finalContent,
                userId: user.idPublic,
            };

            let response;
            if (isEditing && editId) {
                response = await updateDoubtService(editId, payload);
            } else {
                response = await createDoubtService(payload);
            }

            if (!response.ok) {
                throw new Error('Erro na comunicação com o servidor');
            }

            const message = isEditing
                ? 'Sua dúvida foi atualizada!'
                : 'Sua dúvida foi enviada com sucesso.';
            customAlert.toastSuccess(message);

            router.push('/feed');
        } catch (error) {
            customAlert.error('Erro', 'Não foi possível salvar a dúvida no momento.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editId) return;

        const confirm = await customAlert.confirmDelete(
            'Excluir Dúvida?',
            'Tem certeza que deseja excluir esta dúvida?',
        );

        if (confirm.isConfirmed) {
            setIsLoading(true);
            try {
                await deleteQuestionService(editId);
                await customAlert.toastSuccess('Dúvida excluída com sucesso!');
                router.push('/feed');
            } catch (error) {
                customAlert.toastError
                    ? await customAlert.toastError('Não foi possível excluir a dúvida.')
                    : customAlert.error('Erro', 'Não foi possível excluir a dúvida.');
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
        handleDelete,
        isLoading,
        publicationId,
        handleImageAdded,
        isEditing,
    };
}
