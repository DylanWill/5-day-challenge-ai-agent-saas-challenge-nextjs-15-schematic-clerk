import { NextRequest, NextResponse } from 'next/server';
import { getEmail, parseEmail } from '@/lib/gmail';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { emailId: string } }
) {
  // Check if user is authenticated with Clerk
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const emailId = params.emailId;
  
  if (!emailId) {
    return NextResponse.json(
      { success: false, error: 'Email ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get email
    const emailData = await getEmail(emailId);
    const parsedEmail = parseEmail(emailData);
    
    return NextResponse.json({
      success: true,
      email: parsedEmail,
    });
  } catch (error) {
    console.error('Error getting email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get email' },
      { status: 500 }
    );
  }
} 