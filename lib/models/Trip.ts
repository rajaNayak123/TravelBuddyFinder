import mongoose, {Document} from "mongoose";

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId | any; 
  destination: string;
  startDate: Date;
  endDate: Date;
  activities: string[];
  budget: string;
  maxCompanions: number;
  companions: mongoose.Types.ObjectId[];
  description: string;
  createdAt: Date;
}

const TripSchema = new mongoose.Schema({
    userId: {
        type: String,
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
        type: [String],
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

const Trip = mongoose.models.Trip || mongoose.model<ITrip>("Trip", TripSchema);

export {Trip};