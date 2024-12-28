import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isUserProtectedRoute = (route: string) =>
  route.startsWith("/u-home") || route.startsWith("/new-story");

export function middleware(req: NextRequest) {
  const token = req.cookies.get("user")?.value;
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Handle `/` route
  if (pathname === "/") {
    if (token) {
      url.pathname = "/u-home";
    } else {
      url.pathname = "/home";
    }
    return NextResponse.redirect(url);
  }

  if (!token && isUserProtectedRoute(pathname)) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users to `/u-home` if they try to access `/home`
  if (token && pathname === "/home") {
    url.pathname = "/u-home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all routes except public ones like `/home`
    "/((?!_next|_next/static|_next/image|images|favicon.ico).*)",
  ],
};
