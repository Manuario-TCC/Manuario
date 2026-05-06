import { Plus, X, ChevronLeft } from 'lucide-react';
import { NumberStepper } from '../../create/components/NumberStepper';
import Select from 'react-select';
import { customStyles } from '../../create/components/selectStyles';
import { useSearchFilters } from '../hooks/useSearchFilters';

interface SearchFiltersProps {
    filters: any;
    setFilters: (f: any) => void;
}

export default function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
    const {
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
    } = useSearchFilters(filters, setFilters);

    const renderInputConfig = (isMobile = false) => {
        if (!activeConfigFilter) return null;

        if (activeConfigFilter === 'playTime' || activeConfigFilter === 'players') {
            return (
                <NumberStepper
                    label=""
                    value={tempFilterValue}
                    onChange={(val: string) => setTempFilterValue(val)}
                    placeholder={activeConfigFilter === 'playTime' ? 'Minutos' : 'Quantidade'}
                    maxLimit={999}
                />
            );
        }

        if (activeConfigFilter === 'ageRange') {
            return (
                <Select
                    styles={customStyles}
                    options={ageOptions}
                    placeholder="Selecione..."
                    value={ageOptions.find((opt) => opt.value === tempFilterValue) || null}
                    onChange={(opt: any) => setTempFilterValue(opt.value)}
                    isSearchable={false}
                    menuPlacement={isMobile ? 'top' : 'bottom'}
                />
            );
        }

        return (
            <input
                type="text"
                value={tempFilterValue}
                onChange={(e) => setTempFilterValue(e.target.value)}
                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
                placeholder="Digite..."
            />
        );
    };

    const activeOption = filterOptions.find((o) => o.id === activeConfigFilter);
    const ActiveIcon = activeOption?.icon;

    return (
        <div className="mt-4 flex flex-wrap items-center gap-3 relative w-full" ref={menuRef}>
            <button
                onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    if (!isMenuOpen && window.innerWidth >= 640) {
                        handleOpenConfig(filterOptions[0].id);
                    }
                }}
                className="flex items-center gap-2 border border-dashed border-card-border text-sub-text hover:bg-card hover:text-text px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer"
            >
                <Plus className="w-[1rem] h-[1rem]" /> Adicionar filtro
            </button>

            {Object.keys(filters).map((key) => {
                const option = filterOptions.find((o) => o.id === key);
                if (!option) return null;
                const OptionIcon = option.icon;

                return (
                    <div
                        key={key}
                        className="flex items-center gap-2 bg-primary text-text px-4 py-2.5 rounded-full text-sm font-bold shadow-sm"
                    >
                        <OptionIcon size={16} />
                        <span>
                            {option.label}: {filters[key]} {key === 'playTime' ? 'min' : ''}
                        </span>

                        <button
                            onClick={() => removeFilter(key)}
                            className="hover:text-red-400 ml-1 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                );
            })}

            {isMenuOpen && (
                <>
                    <div className="sm:hidden fixed inset-0 z-[100] flex flex-col justify-end">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => {
                                setIsMenuOpen(false);
                                setActiveConfigFilter(null);
                            }}
                        />

                        <div className="relative w-full bg-card border-t border-card-border rounded-t-3xl p-5 pb-10 animate-in slide-in-from-bottom-full duration-300 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                            <div className="w-12 h-1.5 bg-card-border rounded-full mx-auto mb-6" />

                            {!activeConfigFilter ? (
                                <>
                                    <span className="text-xs font-bold text-sub-text uppercase block mb-4 px-1">
                                        Filtrar por
                                    </span>
                                    <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                        {filterOptions.map((opt) => {
                                            const OptIcon = opt.icon;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => handleOpenConfig(opt.id)}
                                                    className="flex items-center gap-3 text-sm px-4 py-3.5 bg-background border border-card-border rounded-xl transition-colors text-left cursor-pointer text-text"
                                                >
                                                    <OptIcon size={18} className="text-text" />
                                                    <span className="font-bold">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col h-full animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <button
                                            onClick={() => setActiveConfigFilter(null)}
                                            className="p-1 text-sub-text hover:text-text cursor-pointer transition-colors"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>

                                        <span className="text-lg font-bold text-text flex items-center gap-2">
                                            {ActiveIcon && (
                                                <ActiveIcon size={20} className="text-primary" />
                                            )}
                                            {activeOption?.label}
                                        </span>
                                    </div>

                                    <div className="mb-8">{renderInputConfig(true)}</div>

                                    <button
                                        onClick={applyFilter}
                                        disabled={!tempFilterValue}
                                        className="w-full bg-primary text-text font-bold py-3.5 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
                                    >
                                        Aplicar Filtro
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex absolute top-14 left-0 gap-4 z-50">
                        <div className="w-64 bg-card border border-card-border rounded-xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2">
                            <span className="text-xs font-bold text-sub-text px-3 py-2 uppercase block mb-1">
                                Filtrar por
                            </span>

                            <div className="flex flex-col gap-1 max-h-[18rem] overflow-y-auto custom-scrollbar">
                                {filterOptions.map((opt) => {
                                    const OptIcon = opt.icon;
                                    const isActive = activeConfigFilter === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleOpenConfig(opt.id)}
                                            className={`flex items-center gap-3 text-sm px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                                                isActive
                                                    ? 'bg-primary text-text font-bold'
                                                    : 'text-sub-text hover:bg-background hover:text-text'
                                            }`}
                                        >
                                            <OptIcon
                                                className={`w-[1rem] h-[1rem] ${
                                                    isActive ? 'text-text' : 'text-sub-text'
                                                }`}
                                            />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {activeConfigFilter && activeOption && (
                            <div className="w-72 bg-card border border-card-border rounded-xl shadow-2xl p-5 animate-in fade-in slide-in-from-left-2 h-fit">
                                <span className="text-base font-bold text-text flex items-center gap-2 mb-5">
                                    {ActiveIcon && <ActiveIcon className="w-[1.1rem] h-[1.1rem]" />}
                                    {activeOption.label}
                                </span>

                                {renderInputConfig(false)}

                                <div className="flex justify-end items-end mt-6">
                                    <button
                                        onClick={applyFilter}
                                        disabled={!tempFilterValue}
                                        className="bg-primary text-text text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
