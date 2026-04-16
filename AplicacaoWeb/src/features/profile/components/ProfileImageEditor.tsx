import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import AvatarEditor from 'react-avatar-editor';
import { X, ZoomIn } from 'lucide-react';

interface ProfileImageEditorProps {
    image: string | File;
    onSave: (file: File) => void;
    onCancel: () => void;
}

const ProfileImageEditor: React.FC<ProfileImageEditorProps> = ({ image, onSave, onCancel }) => {
    const [scale, setScale] = useState<number>(1);
    const editorRef = useRef<AvatarEditor>(null);

    const handleSaveImage = useCallback(() => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'profile_edited.jpg', { type: 'image/jpeg' });
                    onSave(file);
                }
            }, 'image/jpeg');
        }
    }, [onSave]);

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="relative border bg-background border-card-border p-6 rounded-2xl flex flex-col items-center w-full max-w-sm">
                <button
                    className="absolute top-4 right-4 text-color-sub-text hover:text-text transition-colors  cursor-pointer"
                    onClick={onCancel}
                >
                    <X size={24} />
                </button>

                <h1 className="text-xl font-bold mb-6 text-text w-full text-left">Editar Foto</h1>

                <div className="overflow-hidden rounded-full mb-6 bg-black border border-card-border">
                    <AvatarEditor
                        ref={editorRef}
                        image={image}
                        width={250}
                        height={250}
                        border={20}
                        color={[24, 24, 27, 0.8]}
                        scale={scale}
                        rotate={0}
                        borderRadius={125}
                    />
                </div>

                <div className="w-full px-4 flex items-center gap-3 mb-6">
                    <ZoomIn size={20} className="text-sub-text" />
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1 cursor-pointer accent-text h-1.5 bg-card-border rounded-lg appearance-none"
                    />
                </div>

                <div className="flex gap-3 w-full">
                    <button
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-card transition-colors border border-card-border"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-sub-text transition-colors"
                        onClick={handleSaveImage}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(modalContent, document.body);
};

export default ProfileImageEditor;
