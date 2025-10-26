import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import {Trip} from "@/lib/models/Trip";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDatabase();

        const trips = await Trip.find().populate("userId", "name email").sort({ createdAt: -1 })

        return NextResponse.json(trips)

    } catch (error) {
        console.error("Trips fetch error:", error)
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

        const trip = new Trip({
            userId: session.user.id,
            destination: body.destination,
            startDate: body.startDate,
            endDate: body.endDate,
            details: body.details
        });

        return NextResponse.json({ trip }, { status: 201 })
    } catch (error) {
        console.error("Trip creation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}