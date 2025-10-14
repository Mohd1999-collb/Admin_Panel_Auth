import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmai";


export async function POST(req: Request) {
  
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: "All fields required" }, { status: 400 });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ message: "User already exists" }, { status: 400 });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save new user with OTP
    const newUser = new User({ name, email, password, otp, isVerified: false });
    await newUser.save();

    // Send OTP email
    await sendEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
