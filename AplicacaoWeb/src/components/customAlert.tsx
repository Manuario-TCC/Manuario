import Swal, { SweetAlertOptions } from 'sweetalert2';

const swalCustom = Swal.mixin({
    background: '#151718',
    color: '#ffffff',
    customClass: {
        popup: 'border border-card-border rounded-xl shadow-2xl',
        title: 'text-white text-lg',
        htmlContainer: 'text-sub-text',
        confirmButton:
            'bg-primary rounded-xl px-5 py-2.5 font-bold text-white transition-all hover:bg-primary/90',
        cancelButton:
            'bg-card-border rounded-xl px-5 py-2.5 font-bold text-sub-text transition-all hover:text-white',
        actions: 'gap-3 mt-4',
    },
    buttonsStyling: false,
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
