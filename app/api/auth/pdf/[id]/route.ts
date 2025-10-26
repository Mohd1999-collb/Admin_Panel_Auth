import { NextResponse } from "next/server";

import PdfFile from "@/models/PdfFile";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  const file = await PdfFile.findById(params.id);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

//   console.log("Fetched file:", file);
  
  return new NextResponse(file.data, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `inline; filename=${file.filename}`,
    },
  });
}
