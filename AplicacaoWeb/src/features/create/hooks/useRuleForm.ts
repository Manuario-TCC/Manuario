import { useState, useMemo, useEffect, useCallback } from 'react';
import { createRuleService, fetchUserManuals } from '../services/createService';
import { useSession } from '@/src/hooks/useSession';
import Swal from 'sweetalert2';

export function useRuleForm() {
    const { user } = useSession();
    const [manuals, setManuals] = useState<{ value: string; label: string }[]>([]);
    const [publicationId] = useState(() => crypto.randomUUID());
    const [data, setData] = useState({ title: '', type: 'oficial', manualId: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [pendingImages, setPendingImages] = useState<Record<string, File>>({});

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
        const swalConfig = {
            background: '#17141b',
            color: '#ffffff',
            confirmButtonColor: '#470279',
        };

        if (!isValid) {
            Swal.fire({
                title: 'Atenção',
                text: 'Preencha Título, Manual e Conteúdo.',
                icon: 'info',
                ...swalConfig,
            });
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

            const response = await createRuleService(payload);

            if (!response.ok) throw new Error('Erro no banco');

            Swal.fire({
                title: 'Postado!',
                text: 'Sua regra foi salva com sucesso.',
                icon: 'success',
                ...swalConfig,
            });

            setData({ title: '', type: 'oficial', manualId: '', content: '' });
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao salvar no banco.',
                icon: 'error',
                ...swalConfig,
            });
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
        manuals,
        handleImageAdded,
    };
}
