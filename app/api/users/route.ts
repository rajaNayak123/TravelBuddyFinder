import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDatabase();

        const users = await User.find({}).select("-password");

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Users fetch error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}