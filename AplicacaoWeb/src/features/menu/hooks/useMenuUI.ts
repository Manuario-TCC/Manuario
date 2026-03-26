'use client';

import { useState } from 'react';

export function useMenuUI() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return {
        isOpen,
        toggleMenu,
        closeMenu,
    };
}
