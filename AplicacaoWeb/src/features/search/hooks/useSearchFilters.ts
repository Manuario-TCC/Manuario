import { useState, useRef, useEffect } from 'react';
import { Clock, Users, Tags, Settings, Book, Type, Hash } from 'lucide-react';

export function useSearchFilters(filters: any, setFilters: (f: any) => void) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeConfigFilter, setActiveConfigFilter] = useState<string | null>(null);
    const [tempFilterValue, setTempFilterValue] = useState<any>('');
    const menuRef = useRef<HTMLDivElement>(null);

    const ageOptions = [
        { value: 'Livre', label: 'Livre' },
        { value: '10', label: '10 anos' },
        { value: '12', label: '12 anos' },
        { value: '14', label: '14 anos' },
        { value: '16', label: '16 anos' },
        { value: '18', label: '18 anos' },
    ];

    const filterOptions = [
        { id: 'manualType', label: 'Tipo', icon: Type },
        { id: 'edition', label: 'Edição', icon: Hash },
        { id: 'genre', label: 'Gênero', icon: Book },
        { id: 'ageRange', label: 'Class.', icon: Tags },
        { id: 'system', label: 'Sistema', icon: Settings },
        { id: 'playTime', label: 'Tempo', icon: Clock },
        { id: 'players', label: 'Jogadores', icon: Users },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
                setActiveConfigFilter(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const removeFilter = (key: string) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        setFilters(newFilters);
    };

    const applyFilter = () => {
        if (tempFilterValue && activeConfigFilter) {
            setFilters({ ...filters, [activeConfigFilter]: tempFilterValue });
        }
        setActiveConfigFilter(null);
        setIsMenuOpen(false);
        setTempFilterValue('');
    };

    const handleOpenConfig = (optId: string) => {
        setActiveConfigFilter(optId);
        setTempFilterValue(filters[optId] || '');
    };

    return {
        isMenuOpen,
        setIsMenuOpen,
        activeConfigFilter,
        setActiveConfigFilter,
        tempFilterValue,
        setTempFilterValue,
        menuRef,
        ageOptions,
        filterOptions,
        removeFilter,
        applyFilter,
        handleOpenConfig,
    };
}
