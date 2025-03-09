import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Test route called');
    
    // Check if the correct middleware is being used
    const middlewarePath = process.env.NEXT_RUNTIME === 'edge' ? 'Edge Runtime' : 'Node.js Runtime';
    console.log('Middleware Path:', middlewarePath);
    
    // Check if user is authenticated with Clerk
    try {
      const { userId } = auth();
      console.log('Clerk auth check, userId:', userId);
      
      return NextResponse.json({ 
        success: true,
        userId,
        middleware: middlewarePath,
        message: 'Clerk auth is working properly'
      });
    } catch (clerkError) {
      console.error('Error with Clerk authentication:', clerkError);
      return NextResponse.json({ 
        success: false,
        error: 'Clerk authentication error',
        message: clerkError instanceof Error ? clerkError.message : 'Unknown error',
        middleware: middlewarePath
      });
    }
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Test route error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 