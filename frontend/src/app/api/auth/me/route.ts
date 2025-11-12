import { verifyTokenForPage } from '@/src/lib/utils/verifyToken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyTokenForPage(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: payload.id,
        username: payload.username,
        permission: payload.permission,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
