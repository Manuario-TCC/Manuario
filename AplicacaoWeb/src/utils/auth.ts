import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function getAuthUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('manuario_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
}
