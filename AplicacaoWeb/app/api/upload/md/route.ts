import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        const publicationId = formData.get('publicationId') as string;

        if (!file || !publicationId) {
            return NextResponse.json({ error: 'Dados insuficientes.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `img-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;

        const uploadDir = path.join(process.cwd(), 'public', 'upload', 'rules', publicationId);

        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json(
            { url: `/upload/rules/${publicationId}/${filename}` },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json({ error: 'Erro no upload.' }, { status: 500 });
    }
}
