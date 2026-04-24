import ProfilePage from '@/src/features/profile/page';

export default async function ProfileRoute({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    return <ProfilePage id={resolvedParams.id} />;
}
