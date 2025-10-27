import {auth} from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import {Message} from "@/lib/models/Message"
import { createNotification } from "@/components/notification-helper"
import { type NextRequest, NextResponse } from "next/server"
import { User } from "@/lib/models/User"

export async function POST(req: NextRequest){
    try {
        const session = await auth();

        if(!session?.user?.id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { recipientId, content } = await req.json();


        if (!recipientId || !content) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        await connectToDatabase();

        const message = await Message.create({
            senderId: session.user.id,
            recipientId,
            content
        });

        const sender = await User.findById(session.user.id);

        await createNotification(
            recipientId,
            "message",
            `New message from ${sender?.name || "Someone"}`,
            content.substring(0, 100) + (content.length > 100 ? "..." : ""),
            session.user.id,
        )
        return NextResponse.json(message, { status: 201 })
        
    } catch (error) {
        console.error("Message creation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}