import React from 'react';
import { Crown, ShieldCheck } from 'lucide-react';

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
}

export const ProfileUserInfo: React.FC<Props> = ({ name, stats, isAdmin, isSuperAdmin }) => (
    <div className="">
        <div className="flex items-center gap-3 mb-1 w-max">
            <h1 className="text-2xl md:text-3xl font-bold text-text py-0.5">{name}</h1>

            {isSuperAdmin && (
                <div
                    title="Super Administrador"
                    className="flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-1.5 rounded-lg"
                >
                    <Crown size={20} />
                </div>
            )}

            {!isSuperAdmin && isAdmin && (
                <div
                    title="Administrador"
                    className="flex items-center justify-center bg-primary border border-primary text-text p-1.5 rounded-lg"
                >
                    <ShieldCheck size={20} />
                </div>
            )}
        </div>

        <div className="flex gap-4 mt-2 text-sm md:text-base text-sub-text">
            <p>
                <span className="font-bold text-text">{stats?.followers || 0}</span> Seguidores
            </p>
            <p>
                <span className="font-bold text-text">{stats?.following || 0}</span> Seguindo
            </p>
            <p>
                <span className="font-bold text-text">{stats?.rules || 0}</span> Regras Postadas
            </p>
        </div>
    </div>
);
