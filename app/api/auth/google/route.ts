import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/googleAuth';

export async function GET(request: NextRequest) {
  try {
    console.log('Google auth route called');
    
    // Check for Clerk cookie directly instead of using the auth function
    // This is more reliable and less prone to errors
    const hasClerkCookie = Array.from(request.cookies.getAll())
      .some(cookie => cookie.name.startsWith('__clerk'));
    
    console.log('Has Clerk cookie:', hasClerkCookie);
    
    // If no Clerk cookie, redirect to sign-in
    if (!hasClerkCookie) {
      console.log('No Clerk cookie found, redirecting to sign-in');
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Generate Google OAuth URL
    try {
      const authUrl = getAuthUrl();
      console.log('Generated Google OAuth URL:', authUrl);
      
      // Redirect to Google OAuth consent screen
      return NextResponse.redirect(authUrl);
    } catch (oauthError) {
      console.error('Error generating Google OAuth URL:', oauthError);
      
      // Check environment variables
      console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
      console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
      console.log('GOOGLE_REDIRECT_URI exists:', !!process.env.GOOGLE_REDIRECT_URI);
      
      // Redirect to email page with specific error
      const errorUrl = new URL('/email', request.url);
      errorUrl.searchParams.set('error', `Failed to generate Google OAuth URL: ${oauthError.message}`);
      return NextResponse.redirect(errorUrl);
    }
  } catch (error) {
    console.error('Error initiating Google OAuth:', error);
    
    // Redirect to email page with error
    const errorUrl = new URL('/email', request.url);
    errorUrl.searchParams.set('error', `Failed to initiate Google authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return NextResponse.redirect(errorUrl);
  }
} 