import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: String,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    read:{
        type: Boolean,
        default: false,
    }
},{timestamps: true});

const Message = (mongoose.models.Message as mongoose.Model<any>) || mongoose.model<any>("Message", messageSchema);

export {Message};