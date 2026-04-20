import Swal, { SweetAlertOptions } from 'sweetalert2';

const swalCustom = Swal.mixin({
    background: 'hsl(var(--card))',
    color: 'hsl(var(--foreground))',
    confirmButtonColor: 'hsl(var(--primary))',
    cancelButtonColor: 'hsl(var(--muted))',
    customClass: {
        popup: 'border border-card-border rounded-xl bg-card',
        title: 'text-white text-lg',
        htmlContainer: 'text-sub-text',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-white transition-all',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold text-white transition-all',
    },
});

export const customAlert = {
    success: (title: string, text?: string) => {
        return swalCustom.fire({ icon: 'success', title, text });
    },
    error: (title: string, text?: string) => {
        return swalCustom.fire({ icon: 'error', title, text });
    },
    warning: (title: string, text?: string) => {
        return swalCustom.fire({ icon: 'warning', title, text });
    },
    confirm: (title: string, text?: string, confirmText = 'Confirmar') => {
        return swalCustom.fire({
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancelar',
        });
    },

    fire: (options: SweetAlertOptions) => {
        return swalCustom.fire(options as any);
    },
};
