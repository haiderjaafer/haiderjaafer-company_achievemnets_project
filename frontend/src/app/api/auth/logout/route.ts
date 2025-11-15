
// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Logout request received');

    // Create response
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );

    // Delete the JWT cookie
    response.cookies.delete('jwt_auth_token');

    console.log('✅ Cookie deleted, user logged out');

    return response;
  } catch (error) {
    console.error('❌ Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Logout failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support GET method for simple logout links
export async function GET(request: NextRequest) {
  return POST(request);
}

