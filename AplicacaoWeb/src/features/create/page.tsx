'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCreateTabs } from './hooks/useCreateTabs';
import { useManualForm } from './hooks/useManualForm';
import { useRuleForm } from './hooks/useRuleForm';
import { useQuestionForm } from './hooks/useQuestionForm';

// Skeleton
const FormSkeleton = () => (
    <div className="w-full flex flex-col gap-5 animate-pulse p-2">
        <div className="h-10 bg-card-border/50 rounded-[0.5rem] w-1/4"></div>
        <div className="h-14 bg-card-border/50 rounded-[0.5rem] w-full"></div>
        <div className="h-[200px] bg-card-border/50 rounded-[0.5rem] w-full mt-4"></div>
        <div className="h-12 bg-card-border/50 rounded-[0.5rem] w-1/3 self-end mt-4"></div>
    </div>
);

// Lazy Load
const LazyManualForm = dynamic(
    () => import('./components/ManualForm').then((mod) => mod.ManualForm),
    { loading: () => <FormSkeleton />, ssr: false },
);

const LazyRuleForm = dynamic(() => import('./components/RuleForm').then((mod) => mod.RuleForm), {
    loading: () => <FormSkeleton />,
    ssr: false,
});

const LazyQuestionForm = dynamic(
    () => import('./components/QuestionForm').then((mod) => mod.QuestionForm),
    { loading: () => <FormSkeleton />, ssr: false },
);

const ManualTab = () => {
    const manualForm = useManualForm();
    return <LazyManualForm {...manualForm} />;
};

const RuleTab = () => {
    const ruleForm = useRuleForm();
    return <LazyRuleForm {...ruleForm} />;
};

const QuestionTab = () => {
    const questionForm = useQuestionForm();
    return <LazyQuestionForm {...questionForm} />;
};

export default function CreateFeature() {
    const { activeTab, setActiveTab, tabs } = useCreateTabs();

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
                                    onClick={() => setActiveTab(tab.id)}
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
                                        <Icon size={18} />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-[1.5rem] sm:p-[2.5rem]">
                    {activeTab === 'manual' && <ManualTab />}
                    {activeTab === 'regra' && <RuleTab />}
                    {activeTab === 'duvida' && <QuestionTab />}
                </div>
            </div>
        </div>
    );
}
