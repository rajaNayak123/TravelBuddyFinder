import {auth} from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import {Message} from "@/lib/models/Message"
import {type NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ userId: string }> }
){
    try {
        const session = await auth();

        if(!session?.user?.id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectToDatabase();

        const { userId } = await params;

        const messages = await Message.find({
            $or:[
                { senderId: session.user.id, recipientId: userId },
                { senderId: userId, recipientId: session.user.id },
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            {
                senderId: userId,
                recipientId: session.user.id,
                read: false,
            },
            { read: true },
        )
        return NextResponse.json(messages, { status: 200 })
    } catch (error) {
        console.error("Messages fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}