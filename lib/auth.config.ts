import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

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

      const isProtectedRoute = protectedRoutes.some((route) => 
        pathname.startsWith(route)
      )

      // Redirect to login if accessing protected route without auth
      if (isProtectedRoute && !isLoggedIn) {
        return false
      }

      // Redirect authenticated users away from auth pages
      if (isLoggedIn && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      return true
    },
  },
  providers: [], // This is just a placeholder
} satisfies NextAuthConfig