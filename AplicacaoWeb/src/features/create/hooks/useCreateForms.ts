import { useState } from 'react';

export type TabType = 'manual' | 'regra' | 'duvida';

export function useCreateForms() {
    const [activeTab, setActiveTab] = useState<TabType>('manual');

    const [ruleForm, setRuleForm] = useState({
        title: '',
        manualId: '',
        content: '',
    });

    const [questionForm, setQuestionForm] = useState({
        title: '',
        game: '',
        content: '',
    });

    const [manualForm, setManualForm] = useState({
        title: '',
        game: '',
        genre: '',
        system: '',
        banner: null as File | null,
        logo: null as File | null,
    });

    const isRuleValid = ruleForm.title.trim() !== '' && ruleForm.manualId !== '';

    const isQuestionValid = questionForm.title.trim() !== '' && questionForm.game.trim() !== '';

    const isManualValid =
        manualForm.title.trim() !== '' &&
        manualForm.game.trim() !== '' &&
        manualForm.genre.trim() !== '';

    return {
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
    };
}
