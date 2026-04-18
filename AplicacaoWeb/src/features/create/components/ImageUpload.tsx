import { ReactNode } from 'react';

interface ImageUploadProps {
    label: string;
    icon: ReactNode;
    onSelect: (file: File | null) => void;
    preview: string | null;
    className?: string;
    centerField?: boolean;
}

export function ImageUpload({
    label,
    icon,
    onSelect,
    preview,
    className = 'w-full h-[12rem]',
    centerField = false,
}: ImageUploadProps) {
    return (
        <div className="flex flex-col gap-[0.5rem] w-full">
            <label className="text-[0.875rem] font-medium ml-[0.25rem] text-sub-text">
                {label}
            </label>

            <div className={centerField ? 'flex justify-center' : 'w-full'}>
                <label
                    className={`${className} border-2 border-dashed border-card-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-card/30 relative overflow-hidden`}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="text-sub-text mb-[0.5rem]">{icon}</div>
                            <span className="text-[0.75rem] text-sub-text text-center px-2">
                                Selecionar
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => onSelect(e.target.files?.[0] || null)}
                    />
                </label>
            </div>
        </div>
    );
}
