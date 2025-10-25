import { Connection } from "mongoose"
import "next-auth"
import { DefaultSession } from "next-auth"

declare global{
    var mongoose:{
        conn:Connection | null,
        promise:Promise<Connection> | null
    }
}

declare module "next-auth" {
    interface Session {
      user: {
        id: string
      } & DefaultSession["user"]
    }
  
    interface User {
      id: string
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string
    }
  }
export {}