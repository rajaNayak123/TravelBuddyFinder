import {auth} from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import {Notification} from "@/lib/models/Notification"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    await Notification.updateMany({ userId: session.user.id, read: false }, { read: true })

    return NextResponse.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Mark all read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
