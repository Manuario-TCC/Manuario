import { useState } from 'react';
import { X } from 'lucide-react';

interface ReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title: string;
    description: string;
    actionLabel?: string;
}

export function ReasonModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    actionLabel = 'Confirmar',
}: ReasonModalProps) {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (reason.trim().length < 5) return;
        onConfirm(reason);
        setReason('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-background border border-gray rounded-xl w-full max-w-md p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sub-text hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-text mb-2">{title}</h2>
                <p className="text-sub-text text-sm mb-4">{description}</p>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Digite o motivo detalhado desta ação..."
                    className="w-full h-24 p-3 bg-background border border-sub-text rounded-lg text-text placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-sub-text hover:bg-gray"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={reason.trim().length < 5}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
