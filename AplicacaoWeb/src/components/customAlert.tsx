import Swal from 'sweetalert2';
import { createRoot } from 'react-dom/client';
import { AlertModal } from './AlertModal';

const toastCustom = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: 'var(--color-card)',
    color: 'var(--color-text)',
    customClass: {
        popup: 'border border-card-border rounded-xl shadow-lg mt-2 mr-2',
        title: 'text-sm font-medium',
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

export const customAlert = {
    toastSuccess: (title: string) => toastCustom.fire({ icon: 'success', title }),
    toastError: (title: string) => toastCustom.fire({ icon: 'error', title }),
    toastWarning: (title: string) => toastCustom.fire({ icon: 'warning', title }),
    toastInfo: (title: string) => toastCustom.fire({ icon: 'info', title }),

    confirmDelete: (title: string, text?: string, confirmText = 'Sim, Excluir') => {
        return new Promise<{ isConfirmed: boolean }>((resolve) => {
            if (typeof window === 'undefined') return resolve({ isConfirmed: false });

            const container = document.createElement('div');
            document.body.appendChild(container);
            const root = createRoot(container);

            const handleClose = (isConfirmed: boolean) => {
                root.unmount();
                container.remove();
                resolve({ isConfirmed });
            };

            root.render(
                <AlertModal
                    title={title}
                    description={text}
                    confirmLabel={confirmText}
                    onConfirm={() => handleClose(true)}
                    onCancel={() => handleClose(false)}
                />,
            );
        });
    },
};
