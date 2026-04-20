import { useState, useMemo, useCallback } from 'react';
import { createDoubtService } from '../services/createService';
import { useSession } from '@/src/hooks/useSession';
import Swal from 'sweetalert2';

export function useQuestionForm() {
    const { user } = useSession();
    const [data, setData] = useState({ title: '', game: '', description: '' });
    const [publicationId] = useState(() => crypto.randomUUID());
    const [isLoading, setIsLoading] = useState(false);
    const [pendingImages, setPendingImages] = useState<Record<string, File>>({});

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
            Swal.fire('Atenção', 'Preencha todos os campos.', 'info');
            return;
        }

        setIsLoading(true);
        try {
            let finalContent = data.description;

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
                userId: user.idPublico,
            };

            const response = await createDoubtService(payload);

            if (!response.ok) throw new Error('Erro no banco');

            Swal.fire('Postado!', 'Sua dúvida foi enviada.', 'success');
            setData({ title: '', game: '', description: '' });
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível salvar a dúvida no banco.', 'error');
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
        handleImageAdded,
    };
}
