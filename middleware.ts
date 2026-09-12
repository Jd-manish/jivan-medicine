import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, getGeoLocale, getPreferredLocale, isValidLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_COOKIE = "jivan_locale";

/**
 * Search crawlers must never be language-redirected. Google indexation of all
 * locale versions depends on bots being able to crawl any locale URL directly
 * and on never being bounced between them. List is intentionally conservative:
 * major search bots plus ad crawlers and rich-result fetchers.
 */
const BOT_PATTERN =
  /googlebot|google-inspectiontool|mediapartners-google|adsbot-google|bingbot|slurp|duckduckbot|baiduspider|yandex(bot|images|media|adnet|metrika)|applebot|linkedinbot|twitterbot|facebookexternalhit|facebot|whats app|discordbot|telegrambot|embedly|quora|pinterest/i;

function isSearchBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_PATTERN.test(userAgent);
}

function preferredLocaleFrom(request: NextRequest): string {
  // 1. Visitor's explicit choice, remembered from a previous visit.
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen && isValidLocale(chosen)) return chosen;

  // 2. Browser language (the most reliable signal — reflects real preference).
  const browser = getPreferredLocale(request.headers.get("accept-language"));
  if (browser !== defaultLocale) return browser;

  // 3. Geo-IP fallback from platform headers (free — no external service).
  return getGeoLocale(request.headers);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/manifest") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];

  // Visitor is already on a localized URL — remember the explicit choice and
  // serve the page without any redirect loop.
  if (isValidLocale(pathLocale)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      sameSite: "lax",
    });
    return response;
  }

  // Bots are never redirected: they crawl whichever URL they requested, so
  // every single locale version can enter and stay in the index.
  if (isSearchBot(request.headers.get("user-agent"))) {
    return NextResponse.next();
  }

  // Humans hitting a bare path get a single temporary (307, never 301) redirect
  // to their preferred locale. Temporary status keeps every locale variant
  // independently indexable instead of consolidating to one URL.
  const locale = preferredLocaleFrom(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(url, { status: 307 });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
