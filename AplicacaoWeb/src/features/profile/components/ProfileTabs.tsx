import React from 'react';
import { FileText, Users, Bookmark, Info } from 'lucide-react';

export const ProfileTabs: React.FC = () => (
    <div className="max-w-5xl w-full mx-auto mt-4 px-4 md:px-8 flex items-center gap-8 border-b border-zinc-800">
        <button className="flex items-center gap-2 py-4 border-b-2 border-text text-text font-medium">
            <Users size={18} /> Publicações
        </button>
        <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-sub-text hover:text-text transition-colors font-medium">
            <Users size={18} /> Minhas dúvidas
        </button>
        <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-sub-text hover:text-text transition-colors font-medium">
            <Users size={18} /> Minhas Regras
        </button>
        <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-sub-text hover:text-text transition-colors font-medium">
            <Users size={18} /> Salvos
        </button>
    </div>
);
