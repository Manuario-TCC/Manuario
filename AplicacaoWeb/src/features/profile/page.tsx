'use client';

import { notFound } from 'next/navigation';
import ProfileHeader from './components/ProfileHeader';
import { useProfile } from './hooks/useProfile';

interface ProfilePageProps {
    id: string;
}

export default function ProfilePage({ id }: ProfilePageProps) {
    const { profileData, isLoading, isNotFound, handleFollowToggle, isFollowing } = useProfile(id);

    if (isNotFound) notFound();
    if (isLoading || !profileData) return <div>Carregando...</div>;

    return (
        <main className="w-full flex flex-col min-h-screen">
            <ProfileHeader
                initialData={{
                    name: profileData.name,
                    email: profileData.email,
                    avatarUrl: profileData.avatarUrl,
                    bannerUrl: profileData.bannerUrl,
                    idPublic: profileData.publicId,
                    bio: profileData.bio,
                    links: profileData.links,
                }}
                stats={{
                    followers: profileData.followers,
                    following: profileData.following,
                    rules: profileData.rules,
                }}
                isOwnProfile={profileData.isOwnProfile}
                isFollowing={isFollowing}
                onFollowToggle={handleFollowToggle}
            />
        </main>
    );
}
