import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        name: user.name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        travelStyle: user.travelStyle,
        destinations: user.destinations,
        budget: user.budget,
        languages: user.languages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: body.name,
        age: body.age,
        gender: body.gender,
        bio: body.bio,
        travelStyle: body.travelStyle,
        destinations: body.destinations,
        budget: body.budget,
        languages: body.languages,
      },

      { new: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
