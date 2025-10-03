import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from '@/constants/routes'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the pathname of the request (e.g. /, /login, /dashboard)
  const isLoginPage = pathname === ROUTES.AUTH.LOGIN
  const isAuthPage = pathname === ROUTES.AUTH.FORGOT_PASSWORD ||
                     pathname === ROUTES.AUTH.OTP_VERIFICATION ||
                     pathname === ROUTES.AUTH.RESET_PASSWORD
  const isProtectedPage = pathname.startsWith(ROUTES.DASHBOARD.HOME)
  const isRootPage = pathname === '/'
  
  // Get the access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value
  
  // If it's the root page, redirect to login
  if (isRootPage && !accessToken) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url))
  }
  
  // If user is trying to access login page but is authenticated, redirect to dashboard
  if (isLoginPage && accessToken) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD.HOME, request.url))
  }
  
  // If user is trying to access other auth pages but is authenticated, redirect to dashboard
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD.HOME, request.url))
  }
  
  // If user is trying to access protected pages but is not authenticated
  if (isProtectedPage && !accessToken) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}