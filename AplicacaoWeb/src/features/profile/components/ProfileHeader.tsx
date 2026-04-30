'use client';

import React, { useState } from 'react';
import { useProfileBanner } from '../hooks/useProfileBanner';
import { useProfileAvatar } from '../hooks/useProfileAvatar';
import { useProfileEdit } from '../hooks/useProfileEdit';

import { ProfileBanner } from './ProfileBanner';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileUserInfo } from './ProfileUserInfo';
import { ProfileTabs } from './ProfileTabs';
import ProfileImageEditor from './ProfileImageEditor';
import { ProfileEditModal } from './ProfileEditModal';
import { ProfileLinksModal } from './ProfileLinksModal';

import { Link2, Flag } from 'lucide-react';

interface ProfileHeaderProps {
    initialData: {
        name: string;
        email: string;
        avatarUrl?: string | null;
        bannerUrl?: string | null;
        idPublic: string;
        bio?: string;
        links?: { name: string; url: string }[];
    };
    stats: {
        followers: number;
        following: number;
        rules: number;
    };
    isOwnProfile: boolean;
    isFollowing: boolean;
    onFollowToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    initialData,
    stats,
    isOwnProfile,
    isFollowing,
    onFollowToggle,
}) => {
    const banner = useProfileBanner(initialData.bannerUrl || '/img/bannerPadrao.png', isOwnProfile);
    const avatar = useProfileAvatar(initialData.avatarUrl || '/img/iconePadrao.jpg', isOwnProfile);

    const edit = useProfileEdit(
        initialData.name,
        initialData.email,
        initialData.bio,
        initialData.links,
    );

    const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);

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
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onFollowToggle}
                                        className={`px-6 py-1.5 rounded-full font-semibold transition text-sm cursor-pointer ${
                                            isFollowing
                                                ? 'bg-transparent border border-text text-text hover:bg-card-border'
                                                : 'bg-text text-text-inverted hover:bg-sub-text'
                                        }`}
                                    >
                                        {isFollowing ? 'Seguindo' : 'Seguir'}
                                    </button>
                                    <button
                                        title="Denunciar conta"
                                        className="p-1.5 rounded-full text-sub-text hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                                        onClick={() => console.log('Abrir modal de denúncia')}
                                    >
                                        <Flag size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-md pt-4">
                        <ProfileUserInfo
                            name={initialData.name}
                            isOwnProfile={isOwnProfile}
                            stats={stats}
                        />

                        <div className="mt-4 flex flex-col gap-3">
                            {edit.formData.bio && (
                                <p className="text-sub-text text-sm max-w-lg break-words leading-relaxed">
                                    {edit.formData.bio}
                                </p>
                            )}

                            {edit.formData.links && edit.formData.links.length > 0 && (
                                <button
                                    onClick={() => setIsLinksModalOpen(true)}
                                    className="flex items-center gap-2 text-sub-text hover:text-text text-sm font-bold w-fit transition-colors cursor-pointer"
                                >
                                    <Link2 size={16} />
                                    Ver Links ({edit.formData.links.length})
                                </button>
                            )}
                        </div>
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
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onFollowToggle}
                                    className={`px-6 py-2 rounded-full font-semibold transition text-sm cursor-pointer ${
                                        isFollowing
                                            ? 'bg-transparent border border-text text-text hover:bg-card-border'
                                            : 'bg-text text-text-inverted hover:bg-sub-text'
                                    }`}
                                >
                                    {isFollowing ? 'Seguindo' : 'Seguir'}
                                </button>

                                <button
                                    title="Denunciar conta"
                                    className="p-2 rounded-full text-sub-text hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                                    onClick={() => console.log('Abrir modal de denúncia')}
                                >
                                    <Flag size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProfileTabs idPublic={initialData.idPublic} isOwnProfile={isOwnProfile} />

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
                addLink={edit.addLink}
                updateLink={edit.updateLink}
                removeLink={edit.removeLink}
            />

            {isLinksModalOpen && (
                <ProfileLinksModal
                    links={initialData.links}
                    onClose={() => setIsLinksModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProfileHeader;
