import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createRuleService,
    updateRuleService,
    getRuleById,
    deleteRuleService,
    uploadRuleImageService,
} from '../services/rulesService';

import { fetchUserManuals } from '../services/manualService';
import { useSession } from '@/src/hooks/useSession';
import { customAlert } from '@/src/components/customAlert';
import { FEED_QUERY_KEY } from '../../feed/hooks/useFeed';

export function useRuleForm(editId?: string | null) {
    const { user } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const isEditing = !!editId;

    const [publicationId] = useState(() => editId || crypto.randomUUID());
    const [data, setData] = useState({
        title: '',
        type: 'oficial',
        manualId: '',
        content: '',
    });

    const [pendingImages, setPendingImages] = useState<Record<string, File>>({});

    // Buscar regra
    const { data: ruleData, isLoading: isFetchingInitialData } = useQuery({
        queryKey: ['rule', editId],
        queryFn: async () => {
            const res = await getRuleById(editId!);
            if (!res.ok) throw new Error();
            return res.json();
        },
        enabled: isEditing && !!editId,
        retry: false,
    });

    // Buscar manuais
    const { data: manuals = [] } = useQuery({
        queryKey: ['manuals'],
        queryFn: async () => {
            const res = await fetchUserManuals();
            const list = await res.json();
            return list.map((m: any) => ({
                value: m.id,
                label: m.name,
            }));
        },
    });

    useEffect(() => {
        if (!ruleData || !user) return;

        if (ruleData.user?.idPublic !== user.idPublic) {
            router.push('/404');
            return;
        }

        const manualIdFromDb = ruleData.manualIds?.length > 0 ? ruleData.manualIds[0] : '';

        setData({
            title: ruleData.name,
            manualId: manualIdFromDb,
            content: ruleData.description,
            type: ruleData.isHouseRule ? 'da_casa' : 'oficial',
        });
    }, [ruleData, user, router]);

    const isValid = useMemo(() => {
        return data.title.trim() !== '' && data.content.trim() !== '' && data.manualId !== '';
    }, [data]);

    const handleImageAdded = useCallback((file: File, tempUrl: string) => {
        setPendingImages((prev) => ({ ...prev, [tempUrl]: file }));
    }, []);

    const saveMutation = useMutation({
        mutationFn: async (status: 'PUBLICADO' | 'PRIVADO') => {
            let finalContent = data.content;

            for (const [tempUrl, file] of Object.entries(pendingImages)) {
                if (finalContent.includes(tempUrl)) {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('publicationId', publicationId);

                    const uploadData = await uploadRuleImageService(formData);
                    finalContent = finalContent.replaceAll(tempUrl, uploadData.url);
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
            return response;
        },

        onSuccess: async (response, status) => {
            const responseData = await response.json();

            await customAlert.toastSuccess(
                isEditing ? 'Sua regra foi atualizada.' : 'Sua regra foi salva com sucesso.',
            );

            queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['user-posts'] });

            if (status === 'PRIVADO') {
                router.push('/feed');
            } else {
                const idPublicRule = responseData.idPublic || editId;
                router.push(`/post/rules/${idPublicRule}`);
            }
        },

        onError: () => {
            customAlert.error('Erro!', 'Ocorreu um erro ao salvar no banco.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteRuleService(editId!),
        onSuccess: async () => {
            await customAlert.toastSuccess('Regra excluída com sucesso!');

            queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['user-posts'] });

            router.push('/feed');
        },
        onError: async () => {
            customAlert.error('Erro', 'Não foi possível excluir a regra.');
        },
    });

    const handleSubmit = async (status: 'PUBLICADO' | 'PRIVADO') => {
        if (!isValid) {
            customAlert.warning('Atenção', 'Preencha Título, Manual e Conteúdo.');
            return;
        }
        await saveMutation.mutateAsync(status);
    };

    const handleDelete = async () => {
        if (!editId) return;

        const confirm = await customAlert.confirmDelete(
            'Excluir Regra?',
            'Tem certeza que deseja excluir esta regra?',
        );

        if (confirm.isConfirmed) {
            await deleteMutation.mutateAsync();
        }
    };

    return {
        data,
        setData,
        isValid,
        handleSubmit,
        isLoading: saveMutation.isPending || deleteMutation.isPending,
        publicationId,
        isFetchingInitialData,
        manuals,
        handleImageAdded,
        handleDelete,
        isEditing,
    };
}
