import React, { useEffect, useState } from 'react';

interface AlertModalProps {
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const AlertModal = ({
    title = 'Excluir Publicação',
    description = 'Tem certeza que deseja excluir? Esta ação é permanente.',
    confirmLabel = 'Sim, Excluir',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
}: AlertModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleAction = (action: () => void) => {
        setIsVisible(false);
        setTimeout(action, 200);
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div
                className="relative overflow-hidden rounded-2xl px-8 pt-10 pb-8 border max-w-md w-full mx-4 shadow-2xl animate-slide-up-in"
                style={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-card-border)',
                }}
            >
                <CornerPip className="top-3 left-3" />
                <CornerPip className="top-3 right-3" rotate />
                <CornerPip className="bottom-3 left-3" rotate />
                <CornerPip className="bottom-3 right-3" />

                <FloatingSuits />

                <div className="relative flex justify-center mb-5">
                    <CardExclamationIcon />
                </div>

                <h2 className="text-center text-2xl font-bold tracking-wide text-white">{title}</h2>
                <p className="text-center mt-3 px-2 leading-relaxed text-[var(--color-sub-text)]">
                    {description}
                </p>

                <div className="flex justify-center gap-3 mt-7">
                    <button
                        onClick={() => handleAction(onConfirm)}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all bg-red-500 hover:bg-red-600 hover:scale-[1.04] active:scale-95 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.7)] cursor-pointer"
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={() => handleAction(onCancel)}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm bg-transparent text-[var(--color-sub-text)] border border-[var(--color-card-border)] transition-all hover:text-white hover:bg-[var(--color-card-border)] hover:scale-[1.04] active:scale-95 cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CornerPip = ({ className, rotate }: { className?: string; rotate?: boolean }) => (
    <div
        className={`absolute text-[var(--color-card-border)] text-xs font-bold select-none ${
            rotate ? 'rotate-180' : ''
        } ${className}`}
    >
        ♠ ♥ ♦ ♣
    </div>
);

const CardExclamationIcon = () => (
    <div className="relative animate-dice-roll">
        <div
            className="relative w-24 h-32 rounded-xl flex items-center justify-center border-2 border-red-500/30 animate-pulse-glow"
            style={{ backgroundColor: 'var(--color-background)' }}
        >
            <span className="absolute top-1.5 left-2 text-red-500 text-xs font-bold">!</span>
            <span className="absolute top-5 left-2 text-red-500 text-[10px]">♦</span>
            <span className="absolute bottom-1.5 right-2 text-red-500 text-xs font-bold rotate-180">
                !
            </span>
            <span className="absolute bottom-5 right-2 text-red-500 text-[10px] rotate-180">♦</span>

            <span
                className="text-5xl font-black text-red-500 leading-none"
                style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}
            >
                !
            </span>
        </div>
    </div>
);

const FloatingSuits = () => {
    const suits = [
        { s: '♠', left: '12%', delay: '0s' },
        { s: '♥', left: '82%', delay: '0.6s' },
        { s: '♦', left: '20%', delay: '1.2s' },
        { s: '♣', left: '75%', delay: '1.8s' },
    ];
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {suits.map((it, i) => (
                <span
                    key={i}
                    className="absolute bottom-4 text-red-500/30 text-lg animate-float-suit"
                    style={{ left: it.left, animationDelay: it.delay }}
                >
                    {it.s}
                </span>
            ))}
        </div>
    );
};
