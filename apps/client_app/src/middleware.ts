import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Считаем авторизованным, если есть хоть что-то
  const isAuth = !!accessToken || !!refreshToken;

  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/signup');

  // 1. Защита приватных страниц: Нет ничего -> на Логин
  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Защита от входа залогиненного: 
  // Редиректим на /feed ТОЛЬКО если есть accessToken.
  // Если есть ТОЛЬКО refreshToken, мы пускаем на /login.
  // Почему? Потому что если accessToken нет, значит клиентский JS решил, 
  // что сессия мертва, и мы не должны мешать ему показать форму входа.
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {  
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};