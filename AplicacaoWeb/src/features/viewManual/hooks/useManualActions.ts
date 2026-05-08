import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { manualService } from '../services/manualService';
import { customAlert } from '@/src/components/customAlert';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/src/services/socket';

export const useManualActions = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isForking, setIsForking] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [exportData, setExportData] = useState<any>(null);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

    const handleFork = async (manualId: string) => {
        try {
            setIsForking(true);
            const data = await manualService.forkManual(manualId);
            router.push(`/manual/${data.manualId}`);
        } catch (error) {
            console.error('Falha ao clonar:', error);
            customAlert.toastError('Erro, Não foi possível clonar o manual.');
        } finally {
            setIsForking(false);
        }
    };

    const handleDisableManual = async (manualIdPublic: string, reason: string) => {
        try {
            setIsDisabling(true);
            const responseData = await manualService.disableManual(manualIdPublic, reason);

            setIsReasonModalOpen(false);
            customAlert.toastSuccess('Manual desativado com sucesso');

            queryClient.invalidateQueries({ queryKey: ['feed'] });
            queryClient.invalidateQueries({ queryKey: ['user-manuals'] });

            if (responseData && responseData.notification) {
                socket.emit('send_notification', responseData.notification);
            }

            router.push('/feed');
        } catch (error: any) {
            console.error(error);
            customAlert.toastError(error.message || 'Erro ao desativar manual');
        } finally {
            setIsDisabling(false);
        }
    };

    const waitForElement = (id: string, timeout = 5000): Promise<HTMLElement> => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const el = document.getElementById(id);
                if (el) return resolve(el);
                if (Date.now() - startTime > timeout)
                    reject(new Error('Timeout: Elemento do PDF não encontrado'));
                requestAnimationFrame(check);
            };
            check();
        });
    };

    const handleDownloadPDF = async (manualIdPublic: string) => {
        if (typeof window === 'undefined') return;

        try {
            setIsDownloading(true);

            const data = await manualService.exportManualPDF(manualIdPublic);

            setExportData(data);

            const element = await waitForElement('pdf-export-content');

            await new Promise((res) => setTimeout(res, 2000));

            const { toPng } = await import('html-to-image');

            const dataUrl = await toPng(element, {
                cacheBust: true,
                style: { opacity: '1', visibility: 'visible' },
                backgroundColor: '#ffffff',
                pixelRatio: 2,
            });

            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(dataUrl);
            const totalImgHeightInMm = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = totalImgHeightInMm;
            let position = 0;

            pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, totalImgHeightInMm);

            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;

                pdf.addPage();

                pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, totalImgHeightInMm);

                heightLeft -= pdfHeight;
            }

            pdf.save(`${data.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);

            customAlert.toastSuccess('PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro no processo de PDF:', error);

            customAlert.toastError('Não foi possível gerar o PDF. Tente novamente.');
        } finally {
            setIsDownloading(false);
            setExportData(null);
        }
    };

    return {
        handleFork,
        isForking,
        handleDisableManual,
        isDisabling,
        handleDownloadPDF,
        isDownloading,
        exportData,
        isReasonModalOpen,
        setIsReasonModalOpen,
    };
};
