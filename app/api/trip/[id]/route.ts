import { connectToDatabase } from "@/lib/db";
import {type NextRequest, NextResponse } from "next/server";
import { Trip } from "@/lib/models/Trip";

export async function GET(req:NextRequest, { params }:{ params: Promise<{ id: string }> }){
    try {
        await connectToDatabase();

        const { id } = await params;
        
        const trip = await Trip.findById(id).populate("userId", "name email");

        if(!trip){
            return NextResponse.json({ message: "Trip not found" }, { status: 404 });
        }

        return NextResponse.json({ trip }, { status: 200 });
    } catch (error) {
        console.error("Error fetching trip:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}