import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
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

const User = mongoose.model("User", UserSchema) || mongoose.models.User; 

export{User};