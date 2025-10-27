import {auth} from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import {Notification} from "@/lib/models/Notification"
import { type NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest){
    try {
        const session = await auth();

        if(!session?.user?.id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectToDatabase();

        const notifications = await Notification.find({userId:session.user.id})
        .sort({ createdAt: -1 })
        .populate("relatedUserId", "name age location profilePictureUrl")
        .populate("relatedTripId", "destination");

        return NextResponse.json(notifications)

    } catch (error) {
        console.error("Notifications fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest){
    try {
        const session = await auth();

        if(!session?.user?.id){
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json();

        await connectToDatabase();

        const notification = await Notification.create({
            userId: body.userId,
            type: body.type,
            title: body.title,
            description: body.description,
            relatedUserId: body.relatedUserId,
            relatedTripId: body.relatedTripId,
        })

        return NextResponse.json(notification, { status: 201 })
    } catch (error) {
        console.error("Notification creation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}