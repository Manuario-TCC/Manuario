import React from 'react';
import { Camera } from 'lucide-react';

interface Props {
    bannerUrl: string;
    isOwnProfile: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
    onClick: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileBanner: React.FC<Props> = ({
    bannerUrl,
    isOwnProfile,
    inputRef,
    onClick,
    onChange,
}) => (
    <div
        className={`relative w-full h-48 md:h-64 bg-card-border overflow-hidden ${isOwnProfile ? 'cursor-pointer group' : ''}`}
        onClick={onClick}
    >
        <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />

        <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {isOwnProfile && (
            <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-text opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Camera size={20} />
            </div>
        )}
        <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={onChange} />
    </div>
);
