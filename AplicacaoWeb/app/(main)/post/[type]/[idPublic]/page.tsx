import { notFound } from 'next/navigation';
import ViewPostFeature from '@/src/features/viewPost/page';

export default async function PostRoute({
    params,
}: {
    params: Promise<{ type: string; idPublic: string }>;
}) {
    const { type, idPublic } = await params;

    if (type !== 'rules' && type !== 'questions' && type !== 'ai') {
        notFound();
    }

    return <ViewPostFeature tipo={type} idPublic={idPublic} />;
}
