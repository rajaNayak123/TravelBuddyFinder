import {auth} from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import {Message} from "@/lib/models/Message"
import { User } from "@/lib/models/User"
import { NextResponse } from "next/server"
import mongoose from "mongoose";

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
        // const userId = new mongoose.Types.ObjectId(session.user.id);
        const userId = session.user.id;

        // Type assertion here
        const messages = await Message.find({
            $or:[
                {senderId: userId},
                {receiverId: userId}
            ]
        }).sort({ createdAt: -1 }).lean() as IMessage[];  // Added .lean() and type assertion

        const userIds = new Set<string>()

        messages.forEach((msg) => {
            if (msg.senderId.toString() !== userId.toString()) {
              userIds.add(msg.senderId.toString())
            } else {
              userIds.add(msg.receiverId.toString())
            }
        })

        const conversations = await Promise.all(
            Array.from(userIds).map(async (contactId) => {
              const user = await User.findById(contactId)
              const lastMessage = messages.find(
                (msg) =>
                  (msg.senderId.toString() === contactId && msg.receiverId.toString() === userId.toString()) ||
                  (msg.senderId.toString() === userId.toString() && msg.receiverId.toString() === contactId),
              )
      
              const unreadCount = await Message.countDocuments({
                senderId: contactId,
                receiverId: userId,
                read: false,
              })
      
              return {
                userId: contactId,
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
