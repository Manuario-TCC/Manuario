import { useState, useRef, useEffect } from 'react';

export function useMediaPickers(setTexto: React.Dispatch<React.SetStateAction<string>>) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [gifSearch, setGifSearch] = useState('');

    const pickerRef = useRef<HTMLDivElement>(null);
    const gifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (gifRef.current && !gifRef.current.contains(event.target as Node)) {
                setShowGifPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleEmoji = () => {
        setShowEmojiPicker((prev) => !prev);
        setShowGifPicker(false);
    };

    const toggleGif = () => {
        setShowGifPicker((prev) => !prev);
        setShowEmojiPicker(false);
        setGifSearch('');
    };

    const onEmojiSelect = (emoji: any) => {
        setTexto((prevTexto: string) => prevTexto + emoji.native);
    };

    const onGifClick = (gif: any, e: React.SyntheticEvent<HTMLElement, Event>) => {
        e.preventDefault();
        setTexto((prevTexto: string) => prevTexto + ` [gif:${gif.images.downsized.url}] `);
        setShowGifPicker(false);
        setGifSearch('');
    };

    return {
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
    };
}
