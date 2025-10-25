import {connectToDatabase} from "@/lib/db";
import {User} from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){
    try {
        const {email, password, name} = await req.json();

        if(!email || !password || !name){
            return NextResponse.json({message:"Missing required fields"}, {status:400});
        }

        await connectToDatabase();

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword
        });

        await newUser.save();

        return NextResponse.json(
            {
              message: "User created successfully",
              user: {
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name,
                },
              },
            },
            { status: 201 },
          )

    } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}