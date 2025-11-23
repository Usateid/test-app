import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // First, handle authentication checks
  const pathname = request.nextUrl.pathname;

  // Remove locale prefix from pathname for route checking
  const pathnameWithoutLocale = pathname.replace(/^\/(it|en)/, "") || "/";

  const protectedRoutes = ["/dashboard", "/admin"];
  const sessionCookie = getSessionCookie(request);

  // Check if the route (without locale) is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (
    !sessionCookie &&
    isProtectedRoute &&
    pathnameWithoutLocale === "/sign-up"
  ) {
    return intlMiddleware(new NextRequest(request.url));
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
