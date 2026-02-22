import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/myrooms", "/profile"];
const ADMIN_ROUTE = "/admin";

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  let role = null;

  if (token) {
    const payload = decodeJwt(token);
    role = payload?.role || null;
  }

  /* 🔒 ADMIN ROUTE PROTECTION */
  if (pathname.startsWith(ADMIN_ROUTE)) {
    if (role !== "superadmin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  /* 🔒 NORMAL PROTECTED ROUTES */
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
