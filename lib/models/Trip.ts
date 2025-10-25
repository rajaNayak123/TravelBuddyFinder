import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    destination: {
        type: String,
        required: true,
      },
    startDate: {
        type: Date,
        required: true,
      },
    endDate: {
        type: Date,
        required: true,
      },
    activities: {
        type: [String],
        default: [],
      },
    budget: {
        type: String,
        enum: ["budget", "moderate", "luxury"],
        required: true,
      },
    maxCompanions: {
        type: Number,
        default: 1,
      },
    companions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
    description: {
        type: String,
        required: false,
      },
    status: {
        type: String,
        enum: ["planning", "ongoing", "completed"],
        default: "planning",
    },
},{timestamps: true});

const Trip = mongoose.model("Trip", TripSchema) || mongoose.models.Trip;

export {Trip};