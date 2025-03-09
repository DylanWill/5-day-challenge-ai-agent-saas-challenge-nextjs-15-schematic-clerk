import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Redirect test route called');
    
    // Create a redirect URL
    const redirectUrl = new URL('/dashboard', request.url);
    console.log('Redirecting to:', redirectUrl.toString());
    
    // Return a redirect response
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in redirect test route:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Redirect test route error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 