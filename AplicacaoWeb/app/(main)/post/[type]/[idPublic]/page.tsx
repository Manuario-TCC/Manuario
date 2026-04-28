import ViewPostFeature from '@/src/features/viewPost/page';

export default async function PostRoute({
    params,
}: {
    params: Promise<{ type: string; idPublic: string }>;
}) {
    const { type, idPublic } = await params;

    return <ViewPostFeature tipo={type} idPublic={idPublic} />;
}
