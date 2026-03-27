import React from 'react';
import { Check, Pencil } from 'lucide-react';

interface Props {
    name: string;
    tempName: string;
    isEditing: boolean;
    isOwnProfile: boolean;
    onTempNameChange: (val: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onStartEdit: () => void;
}

export const ProfileUserInfo: React.FC<Props> = ({
    name,
    tempName,
    isEditing,
    isOwnProfile,
    onTempNameChange,
    onSaveEdit,
    onCancelEdit,
    onStartEdit,
}) => (
    <div className="">
        <div className="flex items-center gap-3 mb-1 group w-max">
            {isEditing && isOwnProfile ? (
                <input
                    autoFocus
                    value={tempName}
                    onChange={(e) => onTempNameChange(e.target.value)}
                    onBlur={onCancelEdit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSaveEdit();
                        if (e.key === 'Escape') onCancelEdit();
                    }}
                    className="bg-transparent border-0 text-2xl md:text-3xl font-bold py-0.5 text-text outline-none focus:border-text focus:ring-0 w-full max-w-[200px] md:max-w-none rounded-none"
                />
            ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-text py-0.5">{name}</h1>
            )}

            {isOwnProfile && (
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();
                        if (isEditing) {
                            onSaveEdit();
                        } else {
                            onStartEdit();
                        }
                    }}
                    className={`flex flex-shrink-0 items-center justify-center transition-opacity hover:text-text ${
                        isEditing
                            ? 'text-texte opacity-100 mt-1'
                            : 'text-sub-text md:opacity-0 md:group-hover:opacity-100'
                    }`}
                >
                    {isEditing ? (
                        <Check className="cursor-pointer" size={20} strokeWidth={2.5} />
                    ) : (
                        <Pencil className="cursor-pointer" size={16} />
                    )}
                </button>
            )}
        </div>

        <div className="flex gap-4 mt-2 text-sm md:text-base text-sub-text">
            <p>
                <span className="font-bold text-text">142</span> Seguidores
            </p>
            <p>
                <span className="font-bold text-text">89</span> Seguindo
            </p>
            <p>
                <span className="font-bold text-text">12</span> Regras Postadas
            </p>
        </div>
    </div>
);
