import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  // Redirect from /emails to /email
  return NextResponse.redirect(new URL('/email', request.url));
} 