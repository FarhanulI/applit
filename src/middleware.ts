// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware executing for:", pathname);

  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies?.token;

  // Define public routes
  const publicRoutes = [
    "/",
    "/signIn",
    "/sign-up",
    "/auth/signIn",
    "/auth/sign-up",
    "/payment/success",
    "/payment/cancel",
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  console.log({ pathname });

  // User is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signIn", req.url));
  }

  // Authenticated user tries to access a public route
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // All other cases — allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
