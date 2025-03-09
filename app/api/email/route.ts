import { NextRequest, NextResponse } from 'next/server';
import { fetchEmails } from '@/actions/gmail';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  // Check if user is authenticated with Clerk
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const maxResults = parseInt(searchParams.get('maxResults') || '50', 10);
  const query = searchParams.get('query') || '';
  
  try {
    // Fetch emails
    const result = await fetchEmails(maxResults, query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
} 