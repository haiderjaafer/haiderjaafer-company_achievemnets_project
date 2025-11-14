import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define role-based route mappings
const ROLE_ROUTES = {
  media: '/media',
  admin: '/admin',
  upload: '/upload',
  viewer: '/viewer',
  Maintenence: '/maintenence',
  demo: '/',
  // Add more roles as needed
  contracts: "/contracts"
};

// Public routes (no authentication required)
const PUBLIC_ROUTES = ['/login', '/register'];

// Routes that anyone authenticated can access (regardless of role)
const OPEN_ROUTES = [
  '/',           // Home page - accessible to all authenticated users
  '/profile',    // User profile
  '/settings',   // User settings
];

// Routes that demo users can access (in addition to OPEN_ROUTES)
const DEMO_ALLOWED_ROUTES = ['/upload'];

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
      console.log('🏠 Already authenticated - redirecting to home page');
      
      // All authenticated users go to home page after login
      return NextResponse.redirect(new URL('/', request.url));
    }

    // ============================================
    // 4. Allow Access to Open Routes for All Authenticated Users
    // ============================================
    if (OPEN_ROUTES.some(route => {
      // Exact match for routes
      if (route === '/') return pathname === '/';
      // StartsWith for other routes
      return pathname.startsWith(route);
    })) {
      console.log('✅ Open route - allowing access for authenticated user');
      return NextResponse.next();
    }

    // ============================================
    // 5. Admin Permission - Access Everything
    // ============================================
    if (userPermission === 'admin') {
      console.log('✅ Admin user - allowing access to all routes');
      return NextResponse.next();
    }

    // ============================================
    // 6. Demo User Access Control
    // ============================================
    if (userRole === 'demo') {
      // Check if demo user is accessing an allowed route
      const isAllowedForDemo = DEMO_ALLOWED_ROUTES.some(route => pathname.startsWith(route));
      
      if (isAllowedForDemo) {
        console.log('✅ Demo user accessing allowed route:', pathname);
        return NextResponse.next();
      } else {
        // Check if trying to access a restricted role-specific route
        const isRoleSpecificRoute = Object.values(ROLE_ROUTES).some(
          route => route !== '/' && pathname.startsWith(route)
        );
        
        if (isRoleSpecificRoute) {
          console.log('🚫 Demo user trying to access restricted route:', pathname, '- redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
        
        // Allow other non-role-specific routes
        console.log('✅ Demo user accessing non-restricted route');
        return NextResponse.next();
      }
    }

    // ============================================
    // 7. Role-Based Access Control for Regular Users
    // ============================================
    
    // Get user's allowed route
    const userRoleRoute = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES];
    
    // Check if user is accessing their own role's route
    if (userRoleRoute && userRoleRoute !== '/' && pathname.startsWith(userRoleRoute)) {
      console.log(`✅ User with role "${userRole}" accessing their route: ${pathname}`);
      return NextResponse.next();
    }

    // Check if user is trying to access a different role's route
    const accessingOtherRoleRoute = Object.entries(ROLE_ROUTES).some(
      ([role, route]) => {
        // Skip root route and user's own route
        if (route === '/' || role === userRole) return false;
        // Check if accessing another role's route
        return pathname.startsWith(route);
      }
    );

    if (accessingOtherRoleRoute) {
      console.log(`🚫 User with role "${userRole}" trying to access another role's route: ${pathname}`);
      
      // Redirect to home page (all users can access home)
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow access to other non-role-specific routes
    console.log('✅ Allowing access to non-restricted route');
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