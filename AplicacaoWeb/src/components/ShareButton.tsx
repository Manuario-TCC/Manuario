import { Share2 } from 'lucide-react';
import { useShare } from '../hooks/useShare';

interface ShareButtonProps {
    type: string;
    idPublic: string;
}

export function ShareButton({ type, idPublic }: ShareButtonProps) {
    const { sharePost } = useShare();

    return (
        <button
            onClick={() => sharePost(type, idPublic)}
            className="flex items-center gap-1.5 text-text hover:text-primary transition-colors"
            aria-label="Compartilhar post"
        >
            <Share2 size={20} />
        </button>
    );
}
