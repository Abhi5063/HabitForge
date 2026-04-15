import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/auth/callback'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Bypass public routes
    if (PUBLIC_ROUTES.some(p => pathname.startsWith(p)) || pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    // Check for authorization (via cookies natively or just generic headers if possible)
    // Next.js middleware cannot easily read localStorage, so we look for an HttpOnly cookie typically 
    // or rely on client-side layout guard. For this requirement, we'll implement a basic check.
    // If the backend sets an accessToken or refreshToken cookie, we check it here:
    
    const hasRefreshToken = request.cookies.has('refreshToken');
    const hasAccessToken = request.cookies.has('accessToken');

    if (!hasRefreshToken && !hasAccessToken && !PUBLIC_ROUTES.includes(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
