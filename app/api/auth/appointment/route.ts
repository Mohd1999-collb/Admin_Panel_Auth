import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, doctor, date, time, symptoms } = await req.json();

    // Create the PDF using jsPDF
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Appointment Confirmation", 70, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 40);
    doc.text(`Email: ${email}`, 20, 50);
    doc.text(`Doctor: ${doctor}`, 20, 60);
    doc.text(`Date: ${date}`, 20, 70);
    doc.text(`Time: ${time}`, 20, 80);
    doc.text(`Symptoms: ${symptoms || "N/A"}`, 20, 90);
    doc.text(
      "\nPlease arrive 10 minutes early for your appointment.\nThank you for choosing our clinic!",
      20,
      110
    );

    //  Convert PDF to Buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Configure Nodemailer (using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // Your Gmail address
        pass: process.env.SMTP_PASS, // Your Gmail App Password
      },
    });

    // Send email with the PDF attachment
    await transporter.sendMail({
      from: `"Clinic Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Appointment Confirmation",
      text: `Dear ${name},\n\nYour appointment with Dr. ${doctor} is confirmed for ${date} at ${time}. Please find attached your confirmation PDF.`,
      attachments: [
        {
          filename: "Appointment_Confirmation.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "✅ Appointment confirmed and PDF sent to email.",
    });
  } catch (error: any) {
    console.error("Error in appointment route:", error);
    return NextResponse.json(
      { success: false, message: "❌ Failed to send email.", error: error.message },
      { status: 500 }
    );
  }
}
