import { auth } from "@/lib/auth";
import { SiteConfig } from "@/site-config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin path)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|admin).*)",
  ],
  runtime: "nodejs",
};

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (
    SiteConfig.features.enableLandingRedirection &&
    session &&
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.redirect(new URL("/servers", request.url));
  }

  return NextResponse.next();
}
