import { connectToDatabase } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { Trip } from "@/lib/models/Trip";
import { User } from "@/lib/models/User";  // ← CRITICAL: Add this import

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Populate both userId and companions references
    const trip = await Trip.findById(id)
      .populate("userId", "name email")
      .populate("companions", "name email");
    
    if (!trip) {
      return NextResponse.json(
        { message: "Trip not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ trip }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error fetching trip:", error);
    console.error("Error details:", error.message);  // ← Add detailed logging
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
