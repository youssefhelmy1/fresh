import { NextRequest, NextResponse } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/booking/success',
  '/api/user-bookings',
  '/api/user-bookings/create',
]

// Middleware function that runs on every request
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Get the authentication token from cookies
    const token = request.cookies.get('auth_token')?.value

    // If no token exists, redirect to login
    if (!token) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    // Add the token to the Authorization header for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('Authorization', `Bearer ${token}`)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/booking/:path*',
    '/api/user-bookings/:path*',
  ],
} 