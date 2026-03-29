import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAuth = !!accessToken || !!refreshToken;

  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/signup');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  if (isAdminPage) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const payload = decodeJwtPayload(accessToken);
    const role = payload?.role;
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {  
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};