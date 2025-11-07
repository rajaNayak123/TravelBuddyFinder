import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "./db"
import { User } from "@/lib/models/User"

export const authConfig = {
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirect errors to signin page
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
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          await connectToDatabase()
          
          // Check if user exists by email or googleId
          let existingUser = await User.findOne({ 
            $or: [
              { email: user.email },
              { googleId: account.providerAccountId }
            ]
          })
          
          if (!existingUser) {
            // Create new user for Google sign in
            const { v4: uuidv4 } = require('uuid');
            existingUser = await User.create({
              _id: uuidv4(),
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              verified: true, // Auto-verify Google users
              // No password for OAuth users
            })
          } else if (!existingUser.googleId) {
            // Link Google account to existing user
            existingUser.googleId = account.providerAccountId
            existingUser.verified = true
            await existingUser.save()
          }
          
          // Update user ID for session
          user.id = existingUser._id.toString()
          
          return true
        } catch (error) {
          console.error("Google sign in error:", error)
          return false
        }
      }
      
      return true
    },
  },
} satisfies NextAuthConfig