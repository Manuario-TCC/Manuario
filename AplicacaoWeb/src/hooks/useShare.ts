import { useCallback } from 'react';
import { customAlert } from '../components/customAlert';

export const useShare = () => {
    const sharePost = useCallback(async (type: string, idPublic: string) => {
        const urlParaCompartilhar = `${window.location.origin}/post/${type}/${idPublic}`;

        const shareData = {
            title: 'Manuario',
            text: 'Dá uma olhada neste conteúdo do Manuario!',
            url: urlParaCompartilhar,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Compartilhamento cancelado ou falhou', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(urlParaCompartilhar);
                customAlert.toastSuccess('Link copiado!');
            } catch (error) {
                console.error('Erro ao copiar o link', error);
            }
        }
    }, []);

    return { sharePost };
};
