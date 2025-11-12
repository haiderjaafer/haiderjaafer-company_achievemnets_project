import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: number;
  username: string;
  permission: string;
  role: string;
  sub?: string; // JWT standard claim for subject (user ID)
  exp?: number; // Expiration time
  iat?: number; // Issued at time
}

export function verifyTokenForPage(token: string): JWTPayload | null {
  try {
    // Validate token exists and is not empty
    if (!token || token.trim() === '') {
      console.log("⚠️ No token provided now");
      return null;
    }

    // Get JWT secret from environment
    const privateKey =  process.env.JWT_SECRET || null;
    
    // Debug: Log if secret is available
    console.log("🔑 JWT_SECRET available:", !!privateKey);
    console.log("🔑 JWT_SECRET length:", privateKey?.length);
    
    if (!privateKey || privateKey.trim() === '') {
      console.error("❌ Missing or empty JWT_SECRET environment variable");
      console.error("Current env vars:", Object.keys(process.env).filter(key => key.includes('JWT')));
      return null; // Don't throw error, just return null
    }

    // Verify token
    console.log("🔐 Verifying token...");
    const decoded = jwt.verify(token, privateKey) as any;
    
    console.log("✅ Token verified successfully");

    // Extract user payload with fallbacks
    const userPayload: JWTPayload = {
      id: decoded.id || parseInt(decoded.sub) || 0,
      username: decoded.username || '',
      permission: decoded.permission || '',
      role: decoded.role || '',
    };

    // Validate required fields
    if (!userPayload.id || !userPayload.username) {
      console.error("❌ Invalid token structure - missing required fields:", userPayload);
      return null;
    }

    console.log("✅ Token payload:", {
      id: userPayload.id,
      username: userPayload.username,
      role: userPayload.role,
    });

    return userPayload;

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.error("❌ Token expired:", error.expiredAt);
    } else if (error.name === 'JsonWebTokenError') {
      console.error("❌ Invalid token:", error.message);
    } else {
      console.error("❌ Token verification error:", error);
    }
    return null;
  }
}