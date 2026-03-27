import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { profileService } from '../services/profileService';

export const useProfileBanner = (initialBannerUrl: string, isOwnProfile: boolean) => {
    const [bannerUrl, setBannerUrl] = useState(initialBannerUrl);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleBannerClick = () => {
        if (isOwnProfile) bannerInputRef.current?.click();
    };

    const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setBannerUrl(tempUrl);

            await profileService.updateBanner(file);

            Swal.fire({
                title: 'Sucesso!',
                text: 'Banner atualizado com sucesso.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                background: '#18181b',
                color: '#fff',
            });
        }
    };

    return {
        bannerUrl,
        bannerInputRef,
        handleBannerClick,
        handleBannerChange,
    };
};
