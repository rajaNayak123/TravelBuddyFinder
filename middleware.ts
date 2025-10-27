import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const token = req.auth
  const pathname = req.nextUrl.pathname

  // Redirect authenticated users away from auth pages
  if (token && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Allow access to public routes
  if (!token && (pathname.startsWith("/auth/") || pathname === "/")) {
    return NextResponse.next()
  }

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/trips",
    "/matches",
    "/messages",
    "/notifications",
    "/search",
  ]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
