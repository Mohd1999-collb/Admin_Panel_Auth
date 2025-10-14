import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateToken } from "@/lib/generateToken";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (!user.isVerified)
      return NextResponse.json({ message: "User not verified" }, { status: 400 });

    if (user.password !== password)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

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
