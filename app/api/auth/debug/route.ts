import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug route called');
    
    // Check if the correct middleware is being used
    const middlewarePath = process.env.NEXT_RUNTIME === 'edge' ? 'Edge Runtime' : 'Node.js Runtime';
    
    // Check environment variables
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
    
    // Check request info
    const url = request.url;
    const cookies = Array.from(request.cookies.getAll()).map(c => ({ name: c.name, value: c.name.startsWith('__clerk') ? '[REDACTED]' : c.value }));
    
    // Try to authenticate with Clerk
    let userId = null;
    let authError = null;
    
    try {
      const authResult = auth();
      userId = authResult.userId;
    } catch (error) {
      authError = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return NextResponse.json({
      success: true,
      runtime: middlewarePath,
      userId,
      authError,
      environment: {
        googleClientIdExists: !!googleClientId,
        googleClientIdValue: googleClientId ? googleClientId.substring(0, 10) + '...' : null,
        googleClientSecretExists: !!googleClientSecret,
        googleClientSecretValue: googleClientSecret ? googleClientSecret.substring(0, 5) + '...' : null,
        googleRedirectUriExists: !!googleRedirectUri,
        googleRedirectUriValue: googleRedirectUri,
      },
      request: {
        url,
        cookieCount: cookies.length,
        cookies,
      }
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Debug route error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 