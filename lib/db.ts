import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!;

if(!MONGO_URI){
    throw new Error("Please check your Mongodb connection string");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null, promise:null};
}

export async function connectToDatabase(){
    if(cached.conn){   // if connection is already exist
        return cached.conn;
    }

    if(!cached.promise){ // when no connection
        const opts = {
            bufferCommands:true,
            maxPoolSize:10
        }
        cached.promise = mongoose.connect(MONGO_URI,opts).then(()=>mongoose.connection)
    }

    try {
      cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;
}