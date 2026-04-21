import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    createRuleService,
    updateRuleService,
    fetchUserManuals,
    getRuleById,
} from '../services/createService';
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
        if (isEditing && editId && user?.idPublico) {
            setIsFetchingInitialData(true);
            setIsLoading(true);

            getRuleById(editId)
                .then(async (res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then((fetchedData) => {
                    if (fetchedData.user?.idPublico !== user.idPublico) {
                        router.push('/404');
                    } else {
                        setData({
                            title: fetchedData.name,
                            manualId: fetchedData.manualId,
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
    }, [editId, isEditing, user?.idPublico, router]);

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
                userId: user.idPublico,
                status,
            };

            let response;
            if (isEditing && editId) {
                response = await updateRuleService(editId, payload);
            } else {
                response = await createRuleService(payload);
            }

            if (!response.ok) throw new Error('Erro no banco');

            customAlert.success(
                'Sucesso!',
                isEditing ? 'Sua regra foi atualizada.' : 'Sua regra foi salva com sucesso.',
            );

            if (!isEditing) {
                setData({ title: '', type: 'oficial', manualId: '', content: '' });
                setPendingImages({});
            }
        } catch (error) {
            customAlert.error('Erro!', 'Ocorreu um erro ao salvar no banco.');
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
        publicationId,
        isFetchingInitialData,
        manuals,
        handleImageAdded,
        isEditing,
    };
}
