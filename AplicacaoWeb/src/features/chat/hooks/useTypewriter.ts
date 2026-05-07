import { useState, useEffect, useRef } from 'react';

export function useTypewriter(content: string, isUser: boolean, speed = 15) {
    const [displayedContent, setDisplayedContent] = useState(isUser ? content : '');
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isUser || !content || hasAnimated.current) {
            setDisplayedContent(content || '');
            return;
        }

        const chars = Array.from(content);
        let currentIndex = 0;
        setDisplayedContent('');

        const intervalId = setInterval(() => {
            currentIndex += 2;
            if (currentIndex >= chars.length) {
                currentIndex = chars.length;
                clearInterval(intervalId);
                hasAnimated.current = true;
                setDisplayedContent(content);
            } else {
                setDisplayedContent(chars.slice(0, currentIndex).join(''));
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [content, isUser, speed]);

    return {
        displayedContent,
        isTyping: !isUser && !hasAnimated.current && displayedContent.length < content.length,
    };
}
