import ViewPostFeature from '@/src/features/viewPost/page';

export default async function PostRoute({
    params,
}: {
    params: Promise<{ tipo: string; idPublico: string }>;
}) {
    const { tipo, idPublico } = await params;

    return <ViewPostFeature tipo={tipo} idPublico={idPublico} />;
}
