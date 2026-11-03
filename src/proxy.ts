import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const requestedPath = `${pathname}${search}`;

  if (!getSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", requestedPath);
    return NextResponse.redirect(loginUrl);
  }

  const headers = new Headers(request.headers);
  headers.set("x-requested-path", requestedPath);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/add-book", "/my-books/:path*", "/my-borrows", "/profile", "/books/:id"],
};
