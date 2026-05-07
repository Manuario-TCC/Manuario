'use client';

import { useState, useEffect } from 'react';

export function useScrollVisibility() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const scrollContainer = document.getElementById('main-content');

        if (!scrollContainer) return;

        const handleScroll = () => {
            const currentScrollY = scrollContainer.scrollTop;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return { isVisible };
}
