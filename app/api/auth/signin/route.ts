import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateToken } from "@/lib/generateToken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (!user.isVerified)
      return NextResponse.json({ message: "User not verified" }, { status: 400 });

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    // Generate JWT token
    const token = generateToken({ id: user._id, email: user.email });

    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return res;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
