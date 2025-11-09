
import { NextResponse } from "next/server";
import PdfFile from "@/models/PdfFile";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file || !title) {
    return NextResponse.json({ error: "Title and file are required" }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const newPdf = await PdfFile.create({
    title,
    filename: file.name,
    data: buffer,
    contentType: file.type,
  });

  return NextResponse.json({ message: "File uploaded successfully", id: newPdf._id });
}

export async function GET() {
  await dbConnect();
  const files = await PdfFile.find().select("title filename uploadedAt");
  return NextResponse.json(files);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { id } = await req.json();

  const deleted = await PdfFile.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "File not found" }, { status: 404 });

  return NextResponse.json({ message: "File deleted successfully" });
}

export async function PUT(req: Request) {
  await dbConnect();
  const formData = await req.formData();
  const id = formData.get("id") as string;
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!id || !title || !file) {
    return NextResponse.json({ error: "Missing ID, title or file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const updated = await PdfFile.findByIdAndUpdate(
    id,
    { title, filename: file.name, data: buffer, contentType: file.type },
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: "File not found" }, { status: 404 });

  return NextResponse.json({ message: "PDF updated successfully" });
}
