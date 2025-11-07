import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmai";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(email, otp);

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
