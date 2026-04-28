'use client';

import React, { useState } from 'react';
import { FileText, Bookmark, BookText } from 'lucide-react';

import { PublicationsTab } from '../views/PublicationsTab';
import { ManualTab } from '../views/ManualTab';
import { SavedTab } from '../views/SavedTab';

interface ProfileTabsProps {
    idPublic: string;
    isOwnProfile: boolean;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ idPublic, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState('Publicações');

    const tabs = [
        { id: 'Publicações', label: 'Publicações', icon: FileText },
        { id: 'Meus manuais', label: 'Meus manuais', icon: BookText },
        ...(isOwnProfile ? [{ id: 'Salvos', label: 'Salvos', icon: Bookmark }] : []),
    ];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Publicações':
                return <PublicationsTab idPublic={idPublic} />;
            case 'Meus manuais':
                return <ManualTab idPublic={idPublic} />;
            case 'Salvos':
                return <SavedTab />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col">
            <div className="max-w-5xl w-full mx-auto mt-4 px-4 md:px-8 flex items-center gap-8 border-b border-gray">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 border-b-2 font-medium transition-colors cursor-pointer ${
                                isActive
                                    ? 'border-text text-text'
                                    : 'border-transparent text-sub-text hover:text-text'
                            }`}
                        >
                            <Icon size={18} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="max-w-5xl w-full mx-auto mt-8 px-4 md:px-8">{renderActiveTab()}</div>
        </div>
    );
};
