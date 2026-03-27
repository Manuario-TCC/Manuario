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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center w-full max-w-sm">
                <button
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                    onClick={onCancel}
                >
                    <X size={24} />
                </button>

                <h1 className="text-xl font-bold mb-6 text-white w-full text-left">Editar Foto</h1>

                <div className="overflow-hidden rounded-full mb-6 bg-black border border-zinc-800">
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
                    <ZoomIn size={20} className="text-zinc-400" />
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1 cursor-pointer accent-white h-1.5 bg-zinc-700 rounded-lg appearance-none"
                    />
                </div>

                <div className="flex gap-3 w-full">
                    <button
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors border border-zinc-700"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors"
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
