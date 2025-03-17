import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/booking',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get('authToken')?.value;
    
    // If no token, redirect to login
    if (!token) {
      const url = new URL('/auth', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    try {
      // Verify the token
      verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      const url = new URL('/auth', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 