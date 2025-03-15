import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your middleware
export default clerkMiddleware(async (auth, req) => {
  // Don't apply middleware to API routes that handle Google authentication
  if (
    req.nextUrl.pathname.startsWith('/api/auth/google') ||
    req.nextUrl.pathname.startsWith('/api/auth/callback/google') ||
    req.nextUrl.pathname.startsWith('/api/test') ||
    req.nextUrl.pathname === '/'
  ) {
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/market-analysis') ||
    req.nextUrl.pathname.startsWith('/reports') ||
    req.nextUrl.pathname.startsWith('/documents') ||
    req.nextUrl.pathname.startsWith('/calendar') ||
    req.nextUrl.pathname.startsWith('/email');
  
  try {
    // Get the authentication state
    const session = await auth();
    
    // If the user is not authenticated and the route is protected, redirect to sign-in
    if (!session.userId && isProtectedRoute) {
      // Create the sign-in URL
      const signInUrl = new URL('/', req.url);
      
      // Redirect to sign-in
      return NextResponse.redirect(signInUrl);
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Auth error in middleware:', error);
    // If there's an error with auth, allow the request to continue
    // The page itself can handle authentication errors
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
