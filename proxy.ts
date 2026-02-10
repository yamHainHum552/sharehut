import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes configuration
 */
const PROTECTED_ROUTES = ["/dashboard", "/myrooms", "/profile"];

const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  /**
   * =========================
   * AUTH ROUTE PROTECTION
   * =========================
   */

  // 🚫 Block unauthenticated users from protected routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🔁 Redirect authenticated users away from login/register
  if (AUTH_ROUTES.includes(pathname)) {
    if (token) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  /**
   * =========================
   * CONTINUE REQUEST
   * =========================
   */
  const response = NextResponse.next();

  /**
   * =========================
   * CONTENT SECURITY POLICY
   * =========================
   */
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' https: data:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: ws: wss: http: localhost:*",
    ].join("; "),
  );

  return response;
}

/**
 * Apply middleware to all routes
 */
export const config = {
  matcher: ["/:path*"],
};
