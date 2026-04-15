// src/proxy.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/login"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extrae el locale del path si existe (/es/login → /login)
  const pathnameWithoutLocale = pathname.replace(/^\/(es|en)/, "") || "/";
  const isPublic = PUBLIC_ROUTES.includes(pathnameWithoutLocale);
  const token = request.cookies.get("auth_token")?.value;

  if (!token && !isPublic) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] ?? "es";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (token && isPublic) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] ?? "es";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
