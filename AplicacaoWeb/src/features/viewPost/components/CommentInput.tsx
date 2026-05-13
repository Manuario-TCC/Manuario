import Image from 'next/image';
import { useSession } from '@/src/hooks/useSession';
import { useCommentInput } from '../hooks/useCommentInput';
import { useMediaPickers } from '../hooks/useMediaPickers';
import { SendHorizontal, Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import pt from '@emoji-mart/data/i18n/pt.json';
import Picker from '@emoji-mart/react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_CHAVE_GIPHY || '');

export default function CommentInput({
    onSubmit,
    onSuccess,
    initialValue = '',
    isReply = false,
    replyingToName,
}: any) {
    const { user } = useSession();

    const userAvatarUrl =
        user?.img && user?.idPublic
            ? `/upload/${user.idPublic}/user/${user.img}`
            : '/img/iconePadrao.jpg';

    const { texto, setTexto, isSubmitting, handleSubmit } = useCommentInput(
        onSubmit,
        onSuccess,
        initialValue,
    );

    const {
        showEmojiPicker,
        setShowEmojiPicker,
        showGifPicker,
        setShowGifPicker,
        gifSearch,
        setGifSearch,
        pickerRef,
        gifRef,
        toggleEmoji,
        toggleGif,
        onEmojiSelect,
        onGifClick,
    } = useMediaPickers(setTexto);

    const fetchGifs = (offset: number) => gf.search(gifSearch || 'trending', { offset, limit: 10 });

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex gap-2 sm:gap-4 items-center w-full ${showEmojiPicker || showGifPicker ? 'relative z-50' : ''}`}
        >
            {!isReply && (
                <Image
                    src={user?.img || '/img/iconePadrao.jpg'}
                    alt="User"
                    width={80}
                    height={80}
                    quality={90}
                    className="rounded-full object-cover shrink-0 w-8 h-8 sm:w-10 sm:h-10 select-none"
                />
            )}

            <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0 relative">
                <div className="flex-1 flex items-center min-w-0 bg-transparent border border-card-border rounded-lg focus-within:border-primary transition-colors pr-1 sm:pr-2">
                    {replyingToName && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold ml-2 shrink-0 select-none flex items-center gap-1">
                            @{replyingToName}
                        </span>
                    )}
                    <input
                        type="text"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder={
                            isReply ? 'Escreva uma resposta...' : 'Adicione um comentário...'
                        }
                        className={`flex-1 min-w-0 bg-transparent text-foreground px-3 sm:px-4 focus:outline-none text-sm w-full ${isReply ? 'py-1.5' : 'py-2.5'}`}
                        disabled={isSubmitting}
                        autoFocus={!!initialValue}
                    />

                    <button
                        type="button"
                        onClick={toggleGif}
                        className="text-sub-text hover:text-primary transition-colors p-1.5 cursor-pointer shrink-0 font-black text-[0.6rem] uppercase tracking-wider"
                    >
                        GIF
                    </button>

                    <button
                        type="button"
                        onClick={toggleEmoji}
                        className="text-sub-text hover:text-primary transition-colors p-1.5 cursor-pointer shrink-0"
                    >
                        <Smile className="w-5 h-5" />
                    </button>
                </div>

                {showEmojiPicker && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0 sm:absolute sm:inset-auto sm:top-[calc(100%+8px)] sm:right-14">
                        <div
                            className="absolute inset-0 bg-black/60 sm:hidden"
                            onClick={() => setShowEmojiPicker(false)}
                        />

                        <div
                            ref={pickerRef}
                            className="relative z-10 shadow-2xl rounded-xl overflow-hidden bg-background border border-card-border"
                        >
                            <style jsx global>{`
                                em-emoji-picker {
                                    --rgb-background: 15, 13, 18;
                                    --color-border: rgba(255, 255, 255, 0.1);
                                    width: 100%;
                                    min-width: 280px;
                                    max-height: 350px;
                                }
                                @media (min-width: 640px) {
                                    em-emoji-picker {
                                        width: 320px;
                                        max-height: 400px;
                                    }
                                }
                            `}</style>

                            <Picker
                                data={data}
                                i18n={pt}
                                onEmojiSelect={onEmojiSelect}
                                theme="dark"
                                previewPosition="none"
                                navPosition="bottom"
                            />
                        </div>
                    </div>
                )}

                {showGifPicker && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0 sm:absolute sm:inset-auto sm:top-[calc(100%+8px)] sm:right-14">
                        <div
                            className="absolute inset-0 bg-black/60 sm:hidden"
                            onClick={() => setShowGifPicker(false)}
                        />

                        <div
                            ref={gifRef}
                            className="relative z-10 w-full max-w-[320px] bg-background border border-card-border rounded-xl p-3 shadow-2xl"
                        >
                            <input
                                type="text"
                                placeholder="Pesquisar GIF..."
                                className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-sm text-text mb-3 focus:outline-none focus:border-primary"
                                onChange={(e) => setGifSearch(e.target.value)}
                                value={gifSearch}
                                autoFocus
                            />
                            <div className="h-[300px] overflow-y-auto custom-scrollbar rounded-lg">
                                <Grid
                                    width={
                                        typeof window !== 'undefined' && window.innerWidth < 640
                                            ? 250
                                            : 290
                                    }
                                    columns={2}
                                    fetchGifs={fetchGifs}
                                    key={gifSearch}
                                    onGifClick={onGifClick}
                                    noResultsMessage="Nenhum GIF encontrado."
                                />
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !texto.trim()}
                    className={`flex items-center justify-center shrink-0 w-10 h-10 sm:w-auto sm:h-auto sm:px-6 bg-primary text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer select-none gap-1 ${isReply ? 'sm:py-1.5' : 'sm:py-2.5'}`}
                >
                    <SendHorizontal className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{isSubmitting ? '...' : 'Postar'}</span>
                </button>
            </div>
        </form>
    );
}
