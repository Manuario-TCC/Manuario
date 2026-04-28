import { Search } from 'lucide-react';

export default function EmptySearch() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 bg-card-border/30 rounded-full flex items-center justify-center mb-4">
                <Search size={40} className="text-primary/60" />
            </div>
            <p className="text-sub-text text-sm max-w-[30rem] mt-4">
                Digite um nome acima para encontrar manuais de jogos, regras específicas ou outros
                jogadores.
            </p>
        </div>
    );
}
