import { NextResponse } from "next/server";

import Blog from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";

/* CREATE BLOG */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const blog = await Blog.create(body);

    return NextResponse.json(
      { success: true, data: blog },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* GET ALL BLOGS (Admin / Blog list) */
export async function GET() {
  try {
    await dbConnect();

    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: blogs },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
