'use client';

import React from 'react';
import { useProfileBanner } from '../hooks/useProfileBanner';
import { useProfileAvatar } from '../hooks/useProfileAvatar';
import { useProfileName } from '../hooks/useProfileName';

import { ProfileBanner } from './ProfileBanner';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileUserInfo } from './ProfileUserInfo';
import { ProfileTabs } from './ProfileTabs';
import ProfileImageEditor from './ProfileImageEditor';

interface ProfileHeaderProps {
    initialData: {
        name: string;
        avatarUrl?: string | null;
        bannerUrl?: string | null;
    };
    isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ initialData, isOwnProfile }) => {
    const banner = useProfileBanner(initialData.bannerUrl || '/img/bannerPadrao.png', isOwnProfile);
    const avatar = useProfileAvatar(initialData.avatarUrl || '/img/iconePadrao.jpg', isOwnProfile);
    const user = useProfileName(initialData.name);

    return (
        <div className="w-full flex flex-col min-h-screen">
            <ProfileBanner
                bannerUrl={banner.bannerUrl}
                isOwnProfile={isOwnProfile}
                inputRef={banner.bannerInputRef}
                onClick={banner.handleBannerClick}
                onChange={banner.handleBannerChange}
            />

            <div className="px-4 md:px-8 max-w-5xl w-full mx-auto relative pb-4">
                <div className="flex items-start gap-4 md:gap-6">
                    <div className="-mt-16 md:-mt-20">
                        <ProfileAvatar
                            avatarUrl={avatar.avatarUrl}
                            isOwnProfile={isOwnProfile}
                            inputRef={avatar.avatarInputRef}
                            onClick={avatar.handleAvatarClick}
                            onChange={avatar.handleAvatarChange}
                        />
                    </div>

                    <div className="flex-1 pt-2 md:pt-4">
                        <ProfileUserInfo
                            name={user.name}
                            tempName={user.tempName}
                            isEditing={user.isEditingName}
                            isOwnProfile={isOwnProfile}
                            onTempNameChange={user.setTempName}
                            onSaveEdit={user.handleSaveName}
                            onCancelEdit={() => user.setIsEditingName(false)}
                            onStartEdit={() => user.setIsEditingName(true)}
                        />
                    </div>

                    <div className="pt-2 md:pt-4 flex-shrink-0">
                        {isOwnProfile ? (
                            <button className="px-6 py-2 rounded-full border border-card-border text-text font-semibold hover:bg-card-border transition text-sm">
                                Compartilhar Perfil
                            </button>
                        ) : (
                            <button className="px-6 py-2 rounded-full bg-text text-text-inverted font-semibold hover:bg-sub-text transition text-sm">
                                Seguir
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ProfileTabs />

            {avatar.isAvatarEditorOpen && (
                <ProfileImageEditor
                    image={avatar.tempAvatarImage}
                    onSave={avatar.handleSaveEditedAvatar}
                    onCancel={() => avatar.setIsAvatarEditorOpen(false)}
                />
            )}
        </div>
    );
};

export default ProfileHeader;
