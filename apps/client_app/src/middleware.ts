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

function isValidAccessToken(token: string | undefined): boolean {
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  const exp = payload.exp;
  if (typeof exp !== 'number') return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp > nowInSeconds;
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url), 303);
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const hasValidAccessToken = isValidAccessToken(accessToken);

  const isAuth = hasValidAccessToken;

  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/signup');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (!isAuth && !isAuthPage) {
    return redirectTo(request, '/login');
  }

  if (isAuthPage && hasValidAccessToken) {
    return redirectTo(request, '/feed');
  }

  if (isAdminPage) {
    if (!hasValidAccessToken || !accessToken) {
      return redirectTo(request, '/login');
    }
    const payload = decodeJwtPayload(accessToken);
    const role = payload?.role;
    if (role !== 'ADMIN') {
      return redirectTo(request, '/feed');
    }
  }

  return NextResponse.next();
}

export const config = {  
  matcher: ['/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)'],
};