'use client';

import { motion } from 'framer-motion';
import { useCreateForms, TabType } from './hooks/useCreateForms';
import { RuleForm } from './components/RuleForm';
import { QuestionForm } from './components/QuestionForm';
import { ManualForm } from './components/ManualForm';
import { Book, ScrollText, MessageSquareQuote } from 'lucide-react';

import '../../../app/css/editorMD.css';

export default function CreateFeature() {
    const {
        activeTab,
        setActiveTab,
        ruleForm,
        setRuleForm,
        isRuleValid,
        questionForm,
        setQuestionForm,
        isQuestionValid,
        manualForm,
        setManualForm,
        isManualValid,
    } = useCreateForms();

    const tabs = [
        { id: 'manual', label: 'Criar manual', icon: Book },
        { id: 'regra', label: 'Criar regra', icon: ScrollText },
        { id: 'duvida', label: 'Criar dúvida', icon: MessageSquareQuote },
    ] as const;

    return (
        <div className="w-full max-w-[62rem] mx-auto py-[2.5rem] px-[1rem]">
            <div className="bg-card border border-card-border rounded-[1.5rem] overflow-hidden shadow-2xl">
                <div className="flex p-4 mt-2 bg-card">
                    <div className="flex bg-background rounded-[10rem] overflow-hidden">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`relative flex items-center gap-[0.625rem] py-[0.75rem] px-[1.5rem] transition-colors rounded-[10rem] ${
                                        isActive ? 'text-white' : 'text-sub-text hover:text-text'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-tab-indicator"
                                            className="absolute inset-0 bg-primary rounded-[10rem]"
                                            initial={false}
                                            transition={{
                                                type: 'spring',
                                                bounce: 0.2,
                                                duration: 0.6,
                                            }}
                                        />
                                    )}

                                    <span className="relative z-10 flex items-center gap-2 font-bold text-[0.875rem] whitespace-nowrap">
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-[1.5rem] sm:p-[2.5rem]">
                    {activeTab === 'manual' && (
                        <ManualForm
                            data={manualForm}
                            setData={setManualForm}
                            isValid={isManualValid}
                        />
                    )}

                    {activeTab === 'regra' && (
                        <RuleForm data={ruleForm} setData={setRuleForm} isValid={isRuleValid} />
                    )}

                    {activeTab === 'duvida' && (
                        <QuestionForm
                            data={questionForm}
                            setData={setQuestionForm}
                            isValid={isQuestionValid}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
