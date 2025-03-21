import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/auth';

// Array of paths that require authentication
const protectedPaths = [
  '/profile',
  '/booking',
  '/api/user-bookings',
  '/api/user-bookings/create',
];

// Function to check if the path is protected
function isProtectedPath(path: string): boolean {
  return protectedPaths.some(protectedPath => 
    path === protectedPath || 
    path.startsWith(`${protectedPath}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  if (isProtectedPath(pathname)) {
    // Get the token from cookies
    const token = request.cookies.get('authToken')?.value;
    
    // If there's no token or token is invalid, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    
    try {
      // Verify token - on failure this will throw an error and be caught
      const isValid = verifyToken(token);
      if (!isValid) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }
    } catch (error) {
      // Handle verification errors by redirecting
      console.error('Token verification error:', error);
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 