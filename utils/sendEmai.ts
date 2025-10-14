import nodemailer from "nodemailer";

export const sendEmail = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Admin Panel OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  });
};
