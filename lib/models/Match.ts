import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
    userId1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userId2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: false,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "completed"],
        default: "pending",
    },
    matchScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    reason: {
        type: String,
        required: false,
    },
},{timestamps: true});

const Match = mongoose.model("Match", MatchSchema) || mongoose.models.Match;

export {Match};