'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { TabType, useCreateTabs } from './hooks/useCreateTabs';
import { useManualForm } from './hooks/useManualForm';
import { useRuleForm } from './hooks/useRuleForm';
import { useQuestionForm } from './hooks/useQuestionForm';

// Skeleton
const FormSkeleton = () => (
    <div className="flex w-full animate-pulse flex-col gap-5 p-2">
        <div className="h-10 w-1/4 rounded-lg bg-card-border/50" />
        <div className="h-14 w-full rounded-lg bg-card-border/50" />
        <div className="mt-4 h-52 w-full rounded-lg bg-card-border/50" />
        <div className="mt-4 h-12 w-1/3 self-end rounded-lg bg-card-border/50" />
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

const ManualTab = ({ editId }: { editId?: string | null }) => {
    const manualForm = useManualForm(editId);
    return <LazyManualForm {...manualForm} />;
};

const RuleTab = ({ editId }: { editId?: string | null }) => {
    const ruleForm = useRuleForm(editId);
    return <LazyRuleForm {...ruleForm} />;
};

const QuestionTab = ({ editId }: { editId?: string | null }) => {
    const questionForm = useQuestionForm(editId);
    return <LazyQuestionForm {...questionForm} />;
};

function CreateFeatureContent() {
    const { activeTab, setActiveTab, tabs } = useCreateTabs();
    const searchParams = useSearchParams();

    const editId = searchParams.get('id');
    const tabParam = searchParams.get('tab') as TabType;

    useEffect(() => {
        if (tabParam && ['manual', 'regra', 'duvida'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam, setActiveTab]);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-10">
            <div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-2xl">
                <div className="mt-2 flex bg-card p-4">
                    <div className="flex overflow-hidden rounded-full bg-background">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`relative flex items-center gap-2 rounded-full px-6 py-3 transition-colors ${
                                        isActive ? 'text-white' : 'text-sub-text hover:text-text'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-tab-indicator"
                                            className="absolute inset-0 rounded-full bg-primary"
                                            initial={false}
                                            transition={{
                                                type: 'spring',
                                                bounce: 0.2,
                                                duration: 0.6,
                                            }}
                                        />
                                    )}

                                    <span className="relative z-10 flex items-center gap-2 whitespace-nowrap text-sm font-bold">
                                        <Icon size={18} />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    {activeTab === 'manual' && (
                        <ManualTab editId={tabParam === 'manual' ? editId : null} />
                    )}
                    {activeTab === 'regra' && (
                        <RuleTab editId={tabParam === 'regra' ? editId : null} />
                    )}
                    {activeTab === 'duvida' && (
                        <QuestionTab editId={tabParam === 'duvida' ? editId : null} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CreateFeature() {
    return (
        <Suspense fallback={<FormSkeleton />}>
            <CreateFeatureContent />
        </Suspense>
    );
}
