// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import User from "@/models/User";
// import dbConnect from "@/lib/dbConnect";


// export async function POST(req: Request) {
//   try {
//      await dbConnect();

//     const { email, oldPassword, newPassword, confirmPassword } = await req.json();

//     // 1. Validate required fields
//     if (!email || !oldPassword || !newPassword || !confirmPassword) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // 2. Check if new passwords match
//     if (newPassword !== confirmPassword) {
//       return NextResponse.json(
//         { message: "New password and confirm password do not match" },
//         { status: 400 }
//       );
//     }

//     // 3. Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // 4. Compare old password
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { message: "Old password is incorrect" },
//         { status: 401 }
//       );
//     }

//     // 5. Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // 6. Update password in DB
//     user.password = hashedPassword;
//     await user.save();

//     return NextResponse.json(
//       { message: "Password updated successfully" },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     console.error("Error updating password:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { jwtVerify } from "jose"; // for token verification

export async function POST(req: Request) {
  try {
    await dbConnect();
    // 1️⃣ Get token from cookies
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 2️⃣ Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;

    // 3️⃣ Parse request body
    const { oldPassword, newPassword, confirmPassword } = await req.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New password and confirm password do not match" },
        { status: 400 }
      );
    }

    // 4️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 5️⃣ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 401 }
      );
    }
    // 6️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
