import React from 'react';
import { Check, X, Pencil } from 'lucide-react';

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
        {isEditing && isOwnProfile ? (
            <div className="flex items-center gap-2 mb-1">
                <input
                    autoFocus
                    value={tempName}
                    onChange={(e) => onTempNameChange(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded text-xl md:text-2xl font-bold px-3 py-1 text-white outline-none focus:border-zinc-500 max-w-[200px] md:max-w-none"
                />
                <button
                    onClick={onSaveEdit}
                    className="p-2 text-green-400 hover:bg-zinc-800 rounded-full transition flex-shrink-0"
                >
                    <Check size={20} />
                </button>
                <button
                    onClick={onCancelEdit}
                    className="p-2 text-red-400 hover:bg-zinc-800 rounded-full transition flex-shrink-0"
                >
                    <X size={20} />
                </button>
            </div>
        ) : (
            <div className="flex items-center gap-3 mb-1 group w-max">
                <h1 className="text-2xl md:text-3xl font-bold text-text">{name}</h1>
                {isOwnProfile && (
                    <button
                        onClick={onStartEdit}
                        className="text-zinc-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:text-text"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>
        )}

        <div className="flex gap-4 mt-2 text-xs md:text-base text-sub-text">
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
