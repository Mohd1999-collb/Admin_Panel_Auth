// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User";
// import { sendEmail } from "@/utils/sendEmai";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const { name, email, password } = await req.json();

//     if (!name || !email || !password)
//       return NextResponse.json({ message: "All fields are required" }, { status: 400 });

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return NextResponse.json({ message: "User already exists" }, { status: 400 });

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save new user with hashed password
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       otp,
//       isVerified: false,
//     });

//     await newUser.save();

//     // Send OTP email
//     await sendEmail(email, otp);

//     return NextResponse.json({ message: "OTP sent successfully!" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmai";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, captcha } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });

    if (!captcha)
      return NextResponse.json({ message: "Captcha verification failed" }, { status: 400 });

    // ✅ Verify captcha token with Google
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: captcha,
        }),
      }
    );

    const captchaData = await verifyRes.json();
    if (!captchaData.success)
      return NextResponse.json({ message: "Invalid reCAPTCHA" }, { status: 400 });

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ message: "User already exists" }, { status: 400 });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    await newUser.save();

    // ✅ Send OTP email
    await sendEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
