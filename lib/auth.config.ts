import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "./db"
import { User } from "@/lib/models/User"

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

      return true
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await connectToDatabase()

          const user = await User.findOne({ email: credentials.email })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
} satisfies NextAuthConfig