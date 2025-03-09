import { NextRequest, NextResponse } from 'next/server';
import { removeGoogleTokens } from '@/lib/googleAuth';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  // Check if user is authenticated with Clerk
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Remove Google tokens
    removeGoogleTokens();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting from Google:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect from Google' },
      { status: 500 }
    );
  }
} 