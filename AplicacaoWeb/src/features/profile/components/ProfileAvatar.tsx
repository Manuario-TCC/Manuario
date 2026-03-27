import React from 'react';
import { Camera } from 'lucide-react';

interface Props {
    avatarUrl: string;
    isOwnProfile: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
    onClick: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar: React.FC<Props> = ({
    avatarUrl,
    isOwnProfile,
    inputRef,
    onClick,
    onChange,
}) => (
    <>
        <div
            className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 overflow-hidden border-card-border flex-shrink-0 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
            onClick={onClick}
        >
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />

            {isOwnProfile && (
                <div className="absolute inset-0 flex bg-black/40 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-text" size={28} />
                </div>
            )}
        </div>
        <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={onChange} />
    </>
);
