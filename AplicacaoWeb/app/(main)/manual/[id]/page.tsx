import ViewManualFeature from '@/src/features/viewManual/page';

export default async function ManualPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <main className="w-full">
            <ViewManualFeature id={id} />
        </main>
    );
}
