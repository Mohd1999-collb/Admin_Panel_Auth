import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, avatar } = await req.json();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      avatar,
      authType: "google",
    });
  }

  return NextResponse.json({ message: "Google signup success", user });
}
