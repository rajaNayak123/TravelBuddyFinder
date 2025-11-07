import { auth } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { Message } from "@/lib/models/Message"
import { User } from "@/lib/models/User"
import { NextResponse } from "next/server"

// Updated interface to match Mongoose document structure
interface IMessage {
  _id: unknown;
  senderId: {
    toString(): string;
    _id?: unknown;
  };
  receiverId: {
    toString(): string;
    _id?: unknown;
  };
  content: string;
  createdAt: Date;
  read: boolean;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase();
    const userId = session.user.id;

    // Fetch messages without type assertion initially
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 }).lean();

    // Cast after fetching
    const typedMessages = messages as unknown as IMessage[];

    const userIds = new Set<string>();
    typedMessages.forEach((msg) => {
      if (msg.senderId.toString() !== userId.toString()) {
        userIds.add(msg.senderId.toString())
      } else {
        userIds.add(msg.receiverId.toString())
      }
    })

    const conversations = await Promise.all(
      Array.from(userIds).map(async (contactId) => {
        const user = await User.findById(contactId)
        const lastMessage = typedMessages.find(
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
