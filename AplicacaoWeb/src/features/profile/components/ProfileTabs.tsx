'use client';

import React, { useState } from 'react';
import { FileText, Users, Bookmark, Info } from 'lucide-react';

import { PublicationsTab } from '../views/PublicationsTab';
import { QuestionsTab } from '../views/QuestionsTab';
import { RulesTab } from '../views/RulesTab';
import { SavedTab } from '../views/SavedTab';

export const ProfileTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Publicações');

    const tabs = [
        { id: 'Publicações', label: 'Publicações', icon: FileText },
        { id: 'Minhas dúvidas', label: 'Minhas dúvidas', icon: Users },
        { id: 'Minhas Regras', label: 'Minhas Regras', icon: Info },
        { id: 'Salvos', label: 'Salvos', icon: Bookmark },
    ];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Publicações':
                return <PublicationsTab />;
            case 'Minhas dúvidas':
                return <QuestionsTab />;
            case 'Minhas Regras':
                return <RulesTab />;
            case 'Salvos':
                return <SavedTab />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col">
            <div className="max-w-5xl w-full mx-auto mt-4 px-4 md:px-8 flex items-center gap-8 border-b border-zinc-800">
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
