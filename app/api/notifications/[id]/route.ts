import {auth} from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import {Notification} from "@/lib/models/Notification"
import { authOptions } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const notification = await Notification.findByIdAndUpdate(params.id, { read: true }, { new: true })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
