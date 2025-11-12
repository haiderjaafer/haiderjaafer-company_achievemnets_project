import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define role-based route mappings
const ROLE_ROUTES = {
  media: '/media',
  admin: '/admin',
  upload: '/upload',
  viewer: '/viewer',
  Maintenence: '/maintenence',
  demmo:"/"
  
  // Add more roles as needed
};

// Public routes (no authentication required)
const PUBLIC_ROUTES = ['/login', '/register'];

// Routes that anyone can access (regardless of role)
const OPEN_ROUTES = ['/profile', '/settings'];

// Get JWT secret
function getJWTSecret() {
  const secret = process.env.JWT_SECRET || 'privateKey1298488004322';
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 Middleware checking:', { path: pathname });

  // Get token from cookie
  const token = request.cookies.get('jwt_auth_token')?.value;

  console.log('🍪 Token present:', !!token);

  // ============================================
  // 1. No Token - Redirect to Login
  // ============================================
  if (!token) {
    if (PUBLIC_ROUTES.includes(pathname)) {
      console.log('✅ Public route - allowing access');
      return NextResponse.next();
    }

    console.log('🔒 No token - redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ============================================
  // 2. Has Token - Decode and Check Role
  // ============================================
  try {
    const secret = getJWTSecret();
    const { payload } = await jwtVerify(token, secret);

    console.log('✅ Token verified in middleware:', {
      userId: payload.id || payload.sub,
      username: payload.username,
      role: payload.role,
      permission: payload.permission,
    });

    const userRole = payload.role as string;
    const userPermission = payload.permission as string;

    // ============================================
    // 3. Prevent Authenticated Users from Accessing Auth Pages
    // ============================================
    if (pathname === '/login' || pathname === '/register') {
      console.log('🏠 Already authenticated - redirecting based on role');
      
      // Get role-specific route
      const roleRoute = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || '/';
      return NextResponse.redirect(new URL(roleRoute, request.url));
    }

    // ============================================
    // 4. Root Path (/) - Check Access Based on Role
    // ============================================
    if (pathname === '/') {
      // Demo users can stay on root page
      if (userRole === 'demo') {
        console.log('✅ Demo user accessing home page');
        return NextResponse.next();
      }
      
      // Other roles redirect to their specific pages
      console.log('🏠 Root path - redirecting to role-specific page');
      const roleRoute = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES];
      
      if (roleRoute && roleRoute !== '/') {
        return NextResponse.redirect(new URL(roleRoute, request.url));
      }
      
      // If no specific route, allow access
      return NextResponse.next();
    }

    // ============================================
    // 5. Role-Based Access Control
    // ============================================
    
    // Allow access to open routes
    if (OPEN_ROUTES.some(route => pathname.startsWith(route))) {
      console.log('✅ Open route - allowing access');
      return NextResponse.next();
    }

    // Admin can access everything
    if (userPermission === 'admin') {
      console.log('✅ Admin user - allowing access to all routes');
      return NextResponse.next();
    }

    // Special handling for demo users - restrict to / and open routes only
    if (userRole === 'demo') {
      // Demo users can only access root (/) and open routes
      const allowedForDemo = pathname === '/' || 
                            OPEN_ROUTES.some(route => pathname.startsWith(route));
      
      if (allowedForDemo) {
        console.log('✅ Demo user accessing allowed route');
        return NextResponse.next();
      } else {
        console.log('🚫 Demo user trying to access restricted route - redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Check if user is accessing their allowed route
    const roleRoute = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES];
    
    if (roleRoute && pathname.startsWith(roleRoute)) {
      console.log(`✅ User with role "${userRole}" accessing allowed route: ${pathname}`);
      return NextResponse.next();
    }

    // Check if user is trying to access a route for a different role
    const accessingDifferentRoleRoute = Object.entries(ROLE_ROUTES).some(
      ([role, route]) => role !== userRole && route !== '/' && pathname.startsWith(route)
    );

    if (accessingDifferentRoleRoute) {
      console.log(`🚫 User with role "${userRole}" trying to access unauthorized route`);
      
      // Redirect to their role-specific page
      return NextResponse.redirect(new URL(roleRoute || '/', request.url));
    }

    // Allow access to other routes
    console.log('✅ Allowing access to route');
    return NextResponse.next();

  } catch (error: any) {
    console.error('❌ Token verification failed in middleware:', error.message);

    // Invalid token - clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt_auth_token');
    
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};