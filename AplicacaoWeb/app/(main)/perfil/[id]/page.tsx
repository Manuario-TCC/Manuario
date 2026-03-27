import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ProfileHeader from '@/src/features/profile/components/ProfileHeader';

async function getProfileData(idPublico: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const cookieStore = await cookies();
    const token = cookieStore.get('manuario_token')?.value;

    const headers: HeadersInit = {};
    if (token) {
        headers['Cookie'] = `manuario_token=${token}`;
    }

    try {
        const res = await fetch(`${baseUrl}/api/users/${idPublico}`, {
            cache: 'no-store',
            headers,
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Falha ao buscar dados do perfil');
        }

        return res.json();
    } catch (error) {
        console.error('Erro no fetch do perfil:', error);
        return null;
    }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const profileData = await getProfileData(resolvedParams.id);

    if (!profileData) {
        notFound();
    }

    return (
        <main className="w-full flex flex-col min-h-screen">
            <ProfileHeader
                initialData={{
                    name: profileData.name,
                    avatarUrl: profileData.avatarUrl,
                    bannerUrl: profileData.bannerUrl,
                }}
                isOwnProfile={profileData.isOwnProfile}
            />
        </main>
    );
}
