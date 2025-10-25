import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["match", "message", "trip_request", "trip_approved", "review"],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    relatedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    relatedTripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: false,
    },
    read: {
        type: Boolean,
        default: false,
    },
},{timestamps: true});

const Notification = mongoose.model("Notification", NotificationSchema) || mongoose.models.Notification;

export {Notification};