import { connectToDatabase } from "@/lib/db";
import { Notification } from "@/lib/models/Notification";
import {User} from "@/lib/models/User";

export async function createNotification(
    userId: string,
    type: "match" | "message" | "trip_request" | "trip_approved" | "review",
    title: string,
    description: string,
    relatedUserId?: string,
    relatedTripId?: string
){
    try {
        await connectToDatabase();

        const notification = new Notification({
            userId,
            type,
            title,
            description,
            relatedUserId,
            relatedTripId
        });

        await notification.save();

    } catch (error) {
        console.error("Failed to create notification:", error)
    }
}

export async function createMatchNotification(userId1:string, userId2:string, matchScore:number){
    try {
        await connectToDatabase();

        const user2 = await User.findById(userId2);

        // Notify user2 about the match
        await Notification.create({
            userId: userId2,
            type: "match",
            title: `You matched with ${user2?.name || "someone"}!`,
            description: `You have a ${matchScore}% compatibility match. Start chatting to learn more!`,
            relatedUserId: userId1,
        })
    } catch (error) {
        console.error("Failed to create match notification:", error)
    }
}