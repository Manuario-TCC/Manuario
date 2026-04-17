'use client';

import React from 'react';
import { useProfileBanner } from '../hooks/useProfileBanner';
import { useProfileAvatar } from '../hooks/useProfileAvatar';
import { useProfileEdit } from '../hooks/useProfileEdit';

import { ProfileBanner } from './ProfileBanner';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileUserInfo } from './ProfileUserInfo';
import { ProfileTabs } from './ProfileTabs';
import ProfileImageEditor from './ProfileImageEditor';
import { ProfileEditModal } from './ProfileEditModal';

interface ProfileHeaderProps {
    initialData: {
        name: string;
        email: string;
        avatarUrl?: string | null;
        bannerUrl?: string | null;
    };
    isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ initialData, isOwnProfile }) => {
    const banner = useProfileBanner(initialData.bannerUrl || '/img/bannerPadrao.png', isOwnProfile);
    const avatar = useProfileAvatar(initialData.avatarUrl || '/img/iconePadrao.jpg', isOwnProfile);

    const edit = useProfileEdit(initialData.name, initialData.email);

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
                <div className="flex flex-col min-[900px]:flex-row min-[900px]:items-start gap-4 min-[900px]:gap-6">
                    <div className="flex justify-between items-end min-[900px]:items-start w-full min-[900px]:w-auto">
                        <div className="-mt-16">
                            <ProfileAvatar
                                avatarUrl={avatar.avatarUrl}
                                isOwnProfile={isOwnProfile}
                                inputRef={avatar.avatarInputRef}
                                onClick={avatar.handleAvatarClick}
                                onChange={avatar.handleAvatarChange}
                            />
                        </div>

                        <div className="min-[900px]:hidden pb-2 flex-shrink-0">
                            {isOwnProfile ? (
                                <button
                                    onClick={edit.openModal}
                                    className="px-4 py-1.5 rounded-full border border-card-border text-text font-semibold hover:bg-card-border transition text-sm cursor-pointer"
                                >
                                    Editar Perfil
                                </button>
                            ) : (
                                <button className="px-6 py-1.5 rounded-full bg-text text-text-inverted font-semibold hover:bg-sub-text transition text-sm cursor-pointer">
                                    Seguir
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-[900px]:pt-4">
                        <ProfileUserInfo name={edit.formData.name} isOwnProfile={isOwnProfile} />
                    </div>

                    <div className="hidden min-[900px]:block pt-4 flex-shrink-0">
                        {isOwnProfile ? (
                            <button
                                onClick={edit.openModal}
                                className="px-6 py-2 rounded-full border border-card-border text-text font-semibold hover:bg-card-border transition text-sm cursor-pointer"
                            >
                                Editar Perfil
                            </button>
                        ) : (
                            <button className="px-6 py-2 rounded-full bg-text text-text-inverted font-semibold hover:bg-sub-text transition text-sm cursor-pointer">
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

            <ProfileEditModal
                isOpen={edit.isModalOpen}
                onClose={edit.closeModal}
                formData={edit.formData}
                onChange={edit.handleChange}
                onSave={edit.handleSave}
                onDelete={edit.handleDeleteAccount}
                isLoading={edit.isLoading}
            />
        </div>
    );
};

export default ProfileHeader;
