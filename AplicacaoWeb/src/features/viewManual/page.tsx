'use client';

import { useManual } from './hooks/useManual';
import { ManualHeader } from './components/ManualHeader';

export default function ViewManualFeature({ id }: { id: string }) {
    const { manual, loading, error } = useManual(id);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !manual) {
        return (
            <div className="p-8 text-center bg-red-900/20 border border-red-900/50 rounded-xl text-red-400">
                {error || 'Manual não encontrado.'}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <ManualHeader manual={manual} />
        </div>
    );
}
