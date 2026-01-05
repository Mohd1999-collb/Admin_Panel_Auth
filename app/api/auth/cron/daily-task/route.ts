import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 🔐 Security check (VERY IMPORTANT)
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ✅ Example: Daily task logic
    console.log("Running daily cron job...");

    // Example tasks:
    // - Clean old data
    // - Send emails
    // - Generate reports
    // - Sync APIs
    // 0 0 * * *  → Every day at 12:00 AM

    return NextResponse.json({
      success: true,
      message: "Daily cron job executed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cron failed" },
      { status: 500 }
    );
  }
}
