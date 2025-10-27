import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/lib/models/Trip";
import {auth} from "@/lib/auth";
import {User} from "@/lib/models/User";
import {Types} from "mongoose";
import { createNotification } from "@/components/notification-helper"
import { NextResponse } from "next/server";

export async function POST( { params }: { params: Promise<{ id: string }> } ){
    try {
        const session = await auth();

        if(!session?.user?.id){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { id } = await params;
        const trip = await Trip.findById(id);

        if(!trip){
            return NextResponse.json({ message: "Trip not found" }, { status: 404 });
        }

        // Convert string to ObjectId for comparison
        const userObjectId = new Types.ObjectId(session.user.id);

        if (trip.companions.some((companionId: Types.ObjectId) => companionId.equals(userObjectId))) {
            return NextResponse.json({ error: "Already requested or joined" }, { status: 400 });
        }

        if(trip.companions.length >= trip.maxCompanions){
            return NextResponse.json({ message: "Trip is full" }, { status: 400 });
        }

        trip.companions.push(userObjectId);
        await trip.save()

        const requester = await User.findById(userObjectId);

        await createNotification(
          trip.userId.toString(),
          "trip_request",
          `${requester?.name || "Someone"} wants to join your trip`,
          `They're interested in your ${trip.destination} trip starting ${new Date(trip.startDate).toLocaleDateString()}`,
          userObjectId.toString(), // Use ObjectId
          id
        )

    return NextResponse.json({ message: "Request sent successfully", trip })

    } catch (error) {
    console.error("Request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}