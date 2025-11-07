import mongoose, {Document} from "mongoose";

interface INotification extends Document {
    userId: string;
    type: "match" | "message" | "trip_request" | "trip_approved" | "review";
    title: string;
    description: string;
    relatedUserId?: string;
    relatedTripId?: mongoose.Types.ObjectId;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: String,
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
        type: String,
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

const Notification = (mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)) as mongoose.Model<INotification>;
export {Notification};