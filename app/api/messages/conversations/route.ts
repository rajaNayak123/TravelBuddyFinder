import {auth} from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import {Message} from "@/lib/models/Message"
import { User } from "@/lib/models/User"
import { NextResponse } from "next/server"

// Add this interface at the top
interface IMessage {
  senderId: any;
  receiverId: any;
  content: string;
  createdAt: Date;
  read: boolean;
}

export async function GET(){
    try {
        const session = await auth();

        if(!session?.user?.id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectToDatabase();

        // Type assertion here
        const messages = await Message.find({
            $or:[
                {senderId: session.user.id},
                {receiverId: session.user.id}
            ]
        }).sort({ createdAt: -1 }).lean() as IMessage[];  // Added .lean() and type assertion

        const userIds = new Set<string>()

        messages.forEach((msg) => {
            if (msg.senderId.toString() !== session.user.id) {
              userIds.add(msg.senderId.toString())
            } else {
              userIds.add(msg.receiverId.toString())
            }
        })

        const conversations = await Promise.all(
            Array.from(userIds).map(async (userId) => {
              const user = await User.findById(userId)
              const lastMessage = messages.find(
                (msg) =>
                  (msg.senderId.toString() === userId && msg.receiverId.toString() === session.user.id) ||
                  (msg.senderId.toString() === session.user.id && msg.receiverId.toString() === userId),
              )
      
              const unreadCount = await Message.countDocuments({
                senderId: userId,
                receiverId: session.user.id,
                read: false,
              })
      
              return {
                userId,
                userName: user?.name || "Unknown",
                lastMessage: lastMessage?.content,
                lastMessageTime: lastMessage?.createdAt,
                unreadCount,
              }
            }),
        )

        return NextResponse.json(
            conversations.sort((a, b) => {
              const timeA = new Date(a.lastMessageTime || 0).getTime()
              const timeB = new Date(b.lastMessageTime || 0).getTime()
              return timeB - timeA
            }),
        )
    } catch (error) {
        console.error("Conversations fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
