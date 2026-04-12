import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import type { NextRequest } from "next/server"

import { isGuestRoute, isPublicRoute } from "@/lib/auth-routes"
import {
  ensureLocalizedPathname,
  getLocaleFromPathname,
  getPreferredLocale,
  isPathnameMissingLocale,
} from "@/lib/i18n"
import { ensureRedirectPathname, ensureWithoutPrefix } from "@/lib/utils"

function redirect(pathname: string, request: NextRequest) {
  const { hash, search } = request.nextUrl
  let resolvedPathname = pathname

  if (isPathnameMissingLocale(pathname)) {
    const preferredLocale = getPreferredLocale(request)
    resolvedPathname = ensureLocalizedPathname(pathname, preferredLocale)
  }

  // Safely merge search params
  const [basePath, baseQuery] = resolvedPathname.split("?")
  const searchParams = new URLSearchParams(baseQuery || "")
  
  // Add params from the current request (e.g., ?role=student when missing locale)
  const incomingParams = new URLSearchParams(search)
  incomingParams.forEach((value, key) => {
    searchParams.set(key, value)
  })

  // We DO NOT strip 'role' here, because legitimate redirects (like locale redirects)
  // need to preserve the role query parameter.
  const cleanSearch = searchParams.toString()
  resolvedPathname = basePath + (cleanSearch ? `?${cleanSearch}` : "")

  if (hash) {
    resolvedPathname += hash
  }

  const redirectUrl = new URL(resolvedPathname, request.url).toString()
  return NextResponse.redirect(redirectUrl)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(pathname)
  const locale = getLocaleFromPathname(pathname)
  const pathnameWithoutLocale =
    ensureWithoutPrefix(pathname, `/${locale}`) || "/"
  const isNotPublic = !isPublicRoute(pathnameWithoutLocale)

  // Handle authentication for protected and guest routes
  if (isNotPublic) {
    const token = await getToken({ req: request })
    const isAuthenticated = !!token
    const isGuest = isGuestRoute(pathnameWithoutLocale)
    const isProtected = !isGuest

    // Handle Email Verification Requirement
    if (isAuthenticated && token.requiresEmailVerification) {
      if (pathnameWithoutLocale !== "/verify-email") {
        return redirect("/verify-email", request)
      }
      return NextResponse.next()
    }

    // Handle 2FA Requirement
    if (isAuthenticated && token.requires2FA) {
      if (pathnameWithoutLocale !== "/verify-2fa") {
        return redirect("/verify-2fa", request)
      }
      return NextResponse.next()
    }

    // Redirect authenticated users away from guest routes
    if (isAuthenticated && isGuest) {
      const homePath = process.env.NEXT_PUBLIC_HOME_PATHNAME || "/"
      const hasPrefix = homePath.includes("?") ? "&" : "?"
      return redirect(`${homePath}${hasPrefix}role=${token.role || "anonymous"}`, request)
    }

    // Handle Guest Role Redirection
    if (isAuthenticated && token.role === "guest") {
      // Allow access to role selection page
      if (pathnameWithoutLocale === "/role-selection") {
        return NextResponse.next()
      }
      // Redirect all other requests to role selection
      return redirect("/role-selection", request)
    }

    // Prevent fully registered users from accessing role selection
    if (
      isAuthenticated &&
      token.role !== "guest" &&
      pathnameWithoutLocale === "/role-selection"
    ) {
      const homePath = process.env.NEXT_PUBLIC_HOME_PATHNAME || "/"
      const hasPrefix = homePath.includes("?") ? "&" : "?"
      return redirect(`${homePath}${hasPrefix}role=${token.role || "anonymous"}`, request)
    }

    // Redirect unauthenticated users from protected routes to sign-in
    if (!isAuthenticated && isProtected) {
      let redirectPathname = "/sign-in"

      // Maintain the original path and query for redirection
      if (pathnameWithoutLocale !== "") {
        // We want to capture the query params so the user returns exactly where they were,
        // but we explicitly strip 'role' so a stale role doesn't get baked into redirectTo.
        const searchParams = new URLSearchParams(request.nextUrl.search)
        searchParams.delete("role")
        const cleanSearch = searchParams.toString()
        const fullPath = pathname + (cleanSearch ? `?${cleanSearch}` : "")
        
        redirectPathname = ensureRedirectPathname(redirectPathname, fullPath)
      }

      // We use NextResponse.redirect directly here instead of the custom redirect() helper
      // to avoid merging the current nextUrl.search onto the /sign-in URL, which would
      // result in messy duplicate params like /sign-in?redirectTo=...&tab=...
      const redirectUrl = new URL(
        isPathnameMissingLocale(redirectPathname)
          ? ensureLocalizedPathname(redirectPathname, getPreferredLocale(request))
          : redirectPathname,
        request.url
      ).toString()
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect to localized URL if the pathname is missing a locale
  if (!locale) {
    return redirect(pathname, request)
  }

  /**
   * NOTE
   * If your homepage is not '/', you need to configure a redirect
   * in next.config.mjs using the redirects() function,
   * and set the HOME_PATHNAME environment variable accordingly.
   *
   * See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
   */

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images folder
     * - docs
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|docs).*)",
  ],
}
