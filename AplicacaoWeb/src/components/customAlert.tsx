import Swal, { SweetAlertOptions } from 'sweetalert2';

// Configuração do Modal Grande
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

// Configuração do Toast Pequeno
const toastCustom = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1200,
    timerProgressBar: true,
    background: '#151718',
    color: '#ffffff',
    customClass: {
        popup: 'border border-card-border rounded-xl shadow-lg mt-2 mr-2',
        title: 'text-white text-sm font-medium',
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

export const customAlert = {
    // Alertas grandes MODAIS
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

    // Alertas pequenos TOASTS
    toastSuccess: (title: string) => {
        return toastCustom.fire({ icon: 'success', title });
    },
    toastError: (title: string) => {
        return toastCustom.fire({ icon: 'error', title });
    },
    toastWarning: (title: string) => {
        return toastCustom.fire({ icon: 'warning', title });
    },
    toastInfo: (title: string) => {
        return toastCustom.fire({ icon: 'info', title });
    },
};
