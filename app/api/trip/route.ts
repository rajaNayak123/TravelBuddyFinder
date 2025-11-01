import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/lib/models/Trip";
import { User } from "@/lib/models/User";  // ← Add this import
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const trips = await Trip.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    
    return NextResponse.json(trips);
    
  } catch (error) {
    console.error("Trips fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }
    
    const body = await req.json();
    await connectToDatabase();
    
    // Create trip with correct field names matching your schema
    const trip = new Trip({
      userId: session.user.id,
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      activities: body.activities || [],      // ← Fix: was "details"
      budget: body.budget || "moderate",      // ← Fix: add budget
      maxCompanions: body.maxCompanions || 1, // ← Fix: add maxCompanions
      description: body.description || "",    // ← Fix: add description
      companions: [],                          // ← Initialize empty array
      status: "planning",                      // ← Initialize status
    });
    
    await trip.save();  // ← CRITICAL: Actually save to database
    
    // Populate userId before returning
    await trip.populate("userId", "name email");
    
    return NextResponse.json({ trip }, { status: 201 });
    
  } catch (error:any) {
    console.error("Trip creation error:", error);
    console.error("Error details:", error.message);  // ← Add detailed logging
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
