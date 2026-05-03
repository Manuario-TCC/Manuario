import Image from 'next/image';
import { useSession } from '@/src/hooks/useSession';
import { useCommentInput } from '../hooks/useCommentInput';
import { SendHorizontal } from 'lucide-react';

export default function CommentInput({ onSubmit, onSuccess, initialValue = '' }: any) {
    const { user } = useSession();
    const { texto, setTexto, isSubmitting, handleSubmit } = useCommentInput(
        onSubmit,
        onSuccess,
        initialValue,
    );

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 items-center w-full">
            <Image
                src={user?.img || '/img/iconePadrao.jpg'}
                alt="User"
                width={32}
                height={32}
                className="rounded-full object-cover shrink-0 w-[2rem] h-[2rem] user-select-none"
            />

            <div className="flex flex-1 items-center gap-3">
                <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="flex-1 bg-transparent text-foreground py-2.5 px-4 border border-border rounded-md focus:outline-none transition-colors text-sm border-card-border"
                    disabled={isSubmitting}
                    autoFocus={!!initialValue}
                />

                <button
                    type="submit"
                    disabled={isSubmitting || !texto.trim()}
                    className="flex items-center gap-2 flex-row bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-30 whitespace-nowrap cursor-pointer user-select-none"
                >
                    <SendHorizontal className="w-4 h-4" />
                    {isSubmitting ? '...' : 'Postar'}
                </button>
            </div>
        </form>
    );
}
