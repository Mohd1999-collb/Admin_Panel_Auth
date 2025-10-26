import mongoose, { Schema, Document } from "mongoose";

export interface IPdfFile extends Document {
  filename: string;
  data: Buffer;
  contentType: string;
  uploadedAt: Date;
}

const PdfSchema = new Schema<IPdfFile>({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.PdfFile || mongoose.model<IPdfFile>("PdfFile", PdfSchema);
