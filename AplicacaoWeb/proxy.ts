import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/signup', '/api/auth', '/api/users'];

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionToken = request.cookies.get('manuario_token')?.value;
    const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

    if (!sessionToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (sessionToken && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
