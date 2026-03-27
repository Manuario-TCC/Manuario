import { useState } from 'react';
import { profileService } from '../services/profileService';

export const useProfileName = (initialName: string) => {
    const [name, setName] = useState(initialName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(initialName);

    const handleSaveName = async () => {
        if (tempName.trim() === '') return;
        setName(tempName);
        setIsEditingName(false);
        await profileService.updateName(tempName);
    };

    return {
        name,
        tempName,
        setTempName,
        isEditingName,
        setIsEditingName,
        handleSaveName,
    };
};
