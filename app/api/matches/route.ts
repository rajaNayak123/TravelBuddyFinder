import {auth} from "@/lib/auth";
import {User} from "@/lib/models/User";
import {Match} from "@/lib/models/Match";
import {findMatches} from "@/lib/matching";
import { createMatchNotification } from "@/components/notification-helper";
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db";

export async function GET(){
    try {
        const session = await auth()

        if(!session?.user?.id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectToDatabase();

        const matches = await findMatches(session.user.id, 10);

        
    // Fetch full user data for matched users
        const matchedUsers = await Promise.all(
            matches.map(async (match) => {
            const user = await User.findOne({ _id: match.userId })
            return {
                _id: match.userId,
                userId: user,
                matchScore: match.score,
                reasons: match.reasons,
            }
            }),
        )

        return NextResponse.json(matchedUsers)

    } catch (error) {
        console.error("Matches fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if(!session?.user?.id){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }


        const { matchedUserId, matchScore } = await request.json()

        if (!matchedUserId) {
        return NextResponse.json({ error: "Missing matchedUserId" }, { status: 400 })
        }

        await connectToDatabase();

        // Create match record
        const match = await Match.create({
        userId1: session.user.id,
        userId2: matchedUserId,
        status: "accepted",
        matchScore: matchScore || 0,
        })

        // // Create notifications for both users
        // const currentUser = await User.findById(session.user.id)
        // const matchedUser = await User.findById(matchedUserId)

        // Notify the matched user
        await createMatchNotification(session.user.id, matchedUserId, matchScore || 0)

        // Notify current user
        await createMatchNotification(matchedUserId, session.user.id, matchScore || 0)

        return NextResponse.json(match, { status: 201 })

    } catch (error) {
        console.error("Match creation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}