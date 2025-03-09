import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Google auth status route called');
    
    // Check for Clerk cookie directly instead of using the auth function
    const hasClerkCookie = Array.from(request.cookies.getAll())
      .some(cookie => cookie.name.startsWith('__clerk'));
    
    console.log('Has Clerk cookie:', hasClerkCookie);
    
    // If no Clerk cookie, return false
    if (!hasClerkCookie) {
      console.log('No Clerk cookie found');
      return NextResponse.json({ isAuthenticated: false });
    }
    
    // Check if user is authenticated with Google
    const googleTokensCookie = request.cookies.get('google_tokens');
    const isAuthenticated = googleTokensCookie !== undefined;
    console.log('Google tokens cookie present:', isAuthenticated);
    
    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error('Error checking Google authentication status:', error);
    // Return false instead of an error status
    return NextResponse.json({ 
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 