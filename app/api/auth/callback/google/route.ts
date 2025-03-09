import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, storeTokens } from '@/lib/googleAuth';

export async function GET(request: NextRequest) {
  try {
    console.log('Google auth callback route called');
    
    // Check for Clerk cookie directly instead of using the auth function
    const hasClerkCookie = Array.from(request.cookies.getAll())
      .some(cookie => cookie.name.startsWith('__clerk'));
    
    console.log('Has Clerk cookie:', hasClerkCookie);
    
    // If no Clerk cookie, redirect to sign-in
    if (!hasClerkCookie) {
      console.log('No Clerk cookie found, redirecting to sign-in');
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Check for mock mode
    const useMockAuth = process.env.USE_MOCK_GOOGLE_AUTH === 'true';
    
    if (useMockAuth) {
      console.log('Using mock Google authentication in callback');
      // Set a flag in localStorage to indicate the user has attempted to authenticate
      const script = `
        localStorage.setItem('mockGoogleAuthAttempted', 'true');
        window.location.href = '/email?google_connected=true';
      `;
      
      return new NextResponse(
        `<!DOCTYPE html><html><head><script>${script}</script></head><body>Redirecting...</body></html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    // Get authorization code from query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    console.log('Authorization code present:', !!code);
    
    // Check for error parameter
    const error = searchParams.get('error');
    if (error) {
      console.error('Google OAuth error:', error);
      const errorUrl = new URL('/email', request.url);
      errorUrl.searchParams.set('error', `Google authentication failed: ${error}`);
      return NextResponse.redirect(errorUrl);
    }
    
    // If no code is provided, redirect to email page with error
    if (!code) {
      console.log('No authorization code provided');
      const errorUrl = new URL('/email', request.url);
      errorUrl.searchParams.set('error', 'No authorization code provided');
      return NextResponse.redirect(errorUrl);
    }
    
    try {
      // Exchange code for tokens
      console.log('Exchanging code for tokens');
      console.log('Code length:', code.length);
      console.log('Code prefix:', code.substring(0, 10) + '...');
      
      // Add a timeout to prevent hanging
      const tokenExchangePromise = getTokensFromCode(code);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Token exchange timed out after 65 seconds')), 65000)
      );
      
      // Race the token exchange against the timeout
      const tokens = await Promise.race([tokenExchangePromise, timeoutPromise]);
      
      console.log('Tokens received:', !!tokens);
      
      // Store tokens securely
      console.log('Storing tokens');
      const success = storeTokens(tokens);
      console.log('Tokens stored:', success);
      
      if (!success) {
        throw new Error('Failed to store tokens');
      }
      
      // Redirect to email page with success message
      console.log('Redirecting to email page with success message');
      const successUrl = new URL('/email', request.url);
      successUrl.searchParams.set('google_connected', 'true');
      return NextResponse.redirect(successUrl);
    } catch (tokenError) {
      console.error('Error getting or storing tokens:', tokenError);
      console.error('Error details:', JSON.stringify(tokenError, Object.getOwnPropertyNames(tokenError)));
      
      // Redirect to email page with error
      const errorUrl = new URL('/email', request.url);
      errorUrl.searchParams.set('error', `Failed to complete Google authentication: ${tokenError.message}`);
      return NextResponse.redirect(errorUrl);
    }
  } catch (error) {
    console.error('Error handling Google OAuth callback:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Redirect to email page with error
    const errorUrl = new URL('/email', request.url);
    errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Failed to complete Google authentication');
    return NextResponse.redirect(errorUrl);
  }
} 