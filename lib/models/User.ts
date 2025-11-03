import mongoose from "mongoose";

export interface IUser extends Document {
    email: string
    name: string
    password?: string
    googleId?: string
    age?: number;
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    travelStyle?: string[];
    destinations?: string[];
    budget?: "budget" | "moderate" | "luxury";
    languages?: string[];
    bio?: string;
    rating: number;  
    reviewCount: number; 
    verified: boolean;
    createdAt: Date
    updatedAt: Date
  }

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: false,
    },
    name:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: false,
    },
    gender:{
        type: String,
        enum:["male", "female", "other", "prefer-not-to-say"],
        required: false,
    },
    travelStyle:{
        type: [String],
        enum:["adventure", "luxury", "budget", "cultural", "nature", "solo", "family", "romantic"],
        default:[]
    },
    destinations:{
        type: [String],
        default:[]
    },
    budget:{
        type: String,
        enum: ["budget", "moderate", "luxury"],
        required: false,
    },
    languages: {
        type: [String],
        default: [],
      },
    bio: {
        type: String,
        required: false,
      },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
      },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
    reviewCount: {
        type: Number,
        default: 0,
      },
    verified: {
        type: Boolean,
        default: false,
      },
},{timestamps: true})

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema); 

export{User};