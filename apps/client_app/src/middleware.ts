import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAuth = !!accessToken || !!refreshToken;

  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/signup');

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {  
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};