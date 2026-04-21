import { useState } from 'react';
import { Book, ScrollText, MessageSquareQuote } from 'lucide-react';

export type TabType = 'manual' | 'regra' | 'duvida';

export function useCreateTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('manual');

    const tabs = [
        { id: 'manual', label: 'Criar manual', icon: Book },
        { id: 'regra', label: 'Criar regra', icon: ScrollText },
        { id: 'duvida', label: 'Criar dúvida', icon: MessageSquareQuote },
    ] as const;

    return { activeTab, setActiveTab, tabs };
}
