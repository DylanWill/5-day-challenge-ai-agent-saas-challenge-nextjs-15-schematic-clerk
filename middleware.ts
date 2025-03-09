import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ensure nextUrl is defined before accessing pathname
  if (!request.nextUrl) {
    return NextResponse.next();
  }
  
  // Don't apply middleware to API routes that handle Google authentication
  if (
    request.nextUrl.pathname.startsWith('/api/auth/google') ||
    request.nextUrl.pathname.startsWith('/api/auth/callback/google')
  ) {
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/market-analysis') ||
    request.nextUrl.pathname.startsWith('/reports') ||
    request.nextUrl.pathname.startsWith('/documents') ||
    request.nextUrl.pathname.startsWith('/calendar') ||
    request.nextUrl.pathname.startsWith('/video') ||
    request.nextUrl.pathname.startsWith('/email');
  
  // Get the user's authentication state from the Clerk cookies
  const hasClerkCookie = Array.from(request.cookies.getAll())
    .some(cookie => cookie.name.startsWith('__clerk'));
  
  // If the user is not authenticated and the route is protected, redirect to sign-in
  if (!hasClerkCookie && isProtectedRoute) {
    // Create the sign-in URL
    const signInUrl = new URL('/', request.url);
    
    // Redirect to sign-in
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

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
