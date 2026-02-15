import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes configuration
 */
const PROTECTED_ROUTES = ["/dashboard", "/myrooms", "/profile"];

const AUTH_ROUTES = ["/login", "/register"];

const GUEST_ONLY_ROUTES = ["/share"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  if (pathname.startsWith("/room")) {
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (AUTH_ROUTES.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  const response = NextResponse.next();

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

export const config = {
  matcher: ["/:path*"],
};
