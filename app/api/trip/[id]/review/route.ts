import { connectToDatabase } from "@/lib/db";
import { Trip } from "@/lib/models/Trip";
import { Review } from "@/lib/models/Review";
import { User, IUser } from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { Types } from "mongoose";
// import { createNotification } from "@/components/notification-helper"
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { revieweeId, rating, comment } = await req.json();

    if (!revieweeId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    await connectToDatabase();

    const trip = await Trip.findById(id);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const review = await Review.create({
      reviewerId: new Types.ObjectId(session.user.id),
      revieweeId: new Types.ObjectId(revieweeId),
      tripId: new Types.ObjectId(id),
      rating,
      comment,
    });

    // Update user rating with proper typing
    const reviewee = await User.findById(revieweeId);
    if (reviewee) {
      const totalRating = reviewee.rating * reviewee.reviewCount + rating;
      reviewee.reviewCount += 1;
      reviewee.rating = totalRating / reviewee.reviewCount;
      await reviewee.save();
    }

    const reviewer = await User.findById(session.user.id);

    // await createNotification(
    //   revieweeId,
    //   "review",
    //   `${reviewer?.name || "Someone"} left you a review`,
    //   `They gave you a ${rating}-star rating on your ${trip.destination} trip`,
    //   session.user.id,
    //   id,
    // )

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}