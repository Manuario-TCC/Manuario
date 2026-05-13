import React from 'react';
import { RoleBadge } from '@/src/components/RoleBadge';

interface Props {
    name: string;
    isOwnProfile: boolean;
    stats: {
        followers: number;
        following: number;
        rules: number;
    };
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    isBot?: boolean;
}

export const ProfileUserInfo: React.FC<Props> = ({ name, stats, isAdmin, isSuperAdmin, isBot }) => (
    <div className="">
        <div className="flex items-center gap-3 mb-1 w-max">
            <h1 className="text-2xl md:text-3xl font-bold text-text py-0.5">{name}</h1>

            <RoleBadge isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} isBot={isBot} size={18} />
        </div>

        <div className="flex gap-4 mt-2 text-sm md:text-base text-sub-text">
            <p>
                <span className="font-bold text-text">{stats?.followers || 0}</span> Seguidores
            </p>
            <p>
                <span className="font-bold text-text">{stats?.following || 0}</span> Seguindo
            </p>
            <p>
                <span className="font-bold text-text">{stats?.rules || 0}</span> Regras criadas
            </p>
        </div>
    </div>
);
