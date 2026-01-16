import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";

/* GET BLOG BY SLUG (Frontend Blog Page) */
export async function GET(
  req: Request, context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await context.params;

    const blog = await Blog.findOne({
      slug: slug,
      status: "published",
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: blog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* UPDATE BLOG */
export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const { slug } = await context.params;

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: slug },
      body,
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* DELETE BLOG */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await context.params;
    await Blog.findOneAndDelete({ slug: slug });
    return NextResponse.json(
      { success: true, message: "Blog deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
