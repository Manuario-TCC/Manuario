import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    createRuleService,
    updateRuleService,
    getRuleById,
    deleteRuleService,
} from '../services/rulesService';
import { fetchUserManuals } from '../services/manualService';

import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';

export function useRuleForm(editId?: string | null) {
    const { user } = useSession();
    const router = useRouter();

    const [manuals, setManuals] = useState<{ value: string; label: string }[]>([]);
    const [publicationId] = useState(() => crypto.randomUUID());
    const [data, setData] = useState({ title: '', type: 'oficial', manualId: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingInitialData, setIsFetchingInitialData] = useState(!!editId);
    const [pendingImages, setPendingImages] = useState<Record<string, File>>({});

    const isEditing = !!editId;

    useEffect(() => {
        if (isEditing && editId && user?.idPublic) {
            setIsFetchingInitialData(true);
            setIsLoading(true);

            getRuleById(editId)
                .then(async (res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then((fetchedData) => {
                    if (fetchedData.user?.idPublic !== user.idPublic) {
                        router.push('/404');
                    } else {
                        const manualIdFromDb =
                            fetchedData.manualIds && fetchedData.manualIds.length > 0
                                ? fetchedData.manualIds[0]
                                : '';

                        setData({
                            title: fetchedData.name,
                            manualId: manualIdFromDb,
                            content: fetchedData.description,
                            type: fetchedData.isHouseRule ? 'da_casa' : 'oficial',
                        });
                    }
                })
                .catch(() => {
                    router.push('/404');
                })
                .finally(() => {
                    setIsFetchingInitialData(false);
                    setIsLoading(false);
                });
        }
    }, [editId, isEditing, user?.idPublic, router]);

    useEffect(() => {
        fetchUserManuals()
            .then((res) => res.json())
            .then((list) => {
                const options = list.map((m: any) => ({ value: m.id, label: m.name }));
                setManuals(options);
            });
    }, []);

    const isValid = useMemo(() => {
        return data.title.trim() !== '' && data.content.trim() !== '' && data.manualId !== '';
    }, [data]);

    const handleImageAdded = useCallback((file: File, tempUrl: string) => {
        setPendingImages((prev) => ({ ...prev, [tempUrl]: file }));
    }, []);

    const handleSubmit = async (status: 'PUBLICADO' | 'PRIVADO') => {
        if (!isValid) {
            customAlert.warning('Atenção', 'Preencha Título, Manual e Conteúdo.');
            return;
        }

        setIsLoading(true);
        try {
            let finalContent = data.content;

            for (const [tempUrl, file] of Object.entries(pendingImages)) {
                if (finalContent.includes(tempUrl)) {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('publicationId', publicationId);

                    const uploadRes = await fetch('/api/upload/md', {
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
                name: data.title,
                description: finalContent,
                manualId: data.manualId,
                isHouseRule: data.type !== 'oficial',
                userId: user.idPublic,
                status,
            };

            let response;
            if (isEditing && editId) {
                response = await updateRuleService(editId, payload);
            } else {
                response = await createRuleService(payload);
            }

            if (!response.ok) throw new Error('Erro no banco');

            const responseData = await response.json();

            await customAlert.toastSuccess(
                isEditing ? 'Sua regra foi atualizada.' : 'Sua regra foi salva com sucesso.',
            );

            const idPublicRule = responseData.idPublic || editId;
            router.push(`/post/rules/${idPublicRule}`);
        } catch (error) {
            customAlert.error('Erro!', 'Ocorreu um erro ao salvar no banco.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editId) return;

        const confirm = await customAlert.confirmDelete(
            'Excluir Regra?',
            'Tem certeza que deseja excluir esta regra?',
        );

        if (confirm.isConfirmed) {
            setIsLoading(true);
            try {
                await deleteRuleService(editId);

                await customAlert.toastSuccess('Regra excluída com sucesso!');
                router.push('/feed');
            } catch (error) {
                customAlert.toastError
                    ? await customAlert.toastError('Não foi possível excluir a regra.')
                    : customAlert.error('Erro', 'Não foi possível excluir a regra.');
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
        publicationId,
        isFetchingInitialData,
        manuals,
        handleImageAdded,
        handleDelete,
        isEditing,
    };
}
