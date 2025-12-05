import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    reviewerId: {
        type: String,
        ref: "User",
        required: true,
    },
    revieweeId: {
        type: String,
        ref: "User",
        required: true,
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: false,
    },
},{timestamps: true});

const Review = mongoose.model("Review", ReviewSchema) || mongoose.models.Review;

export {Review};