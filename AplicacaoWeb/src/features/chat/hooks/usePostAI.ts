import { useState, useCallback } from 'react';

export function usePostAI() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postData, setPostData] = useState({
        promptUser: '',
        aiResponse: '',
        title: '',
        gameName: '',
        aiToken: '',
    });

    const openPostModal = useCallback(
        (
            content: string,
            userMsg: string,
            metadata?: { title?: string; gameName?: string },
            aiToken?: string,
        ) => {
            setPostData({
                promptUser: userMsg,
                aiResponse: content,
                title: metadata?.title || '',
                gameName: metadata?.gameName || '',
                aiToken: aiToken || '',
            });
            setIsPostModalOpen(true);
        },
        [],
    );

    const closePostModal = () => setIsPostModalOpen(false);

    return { isPostModalOpen, postData, openPostModal, closePostModal };
}
