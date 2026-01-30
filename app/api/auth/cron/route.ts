import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { message: "Unauthorized access. Invalid or missing cron secret." },
      { status: 401 },
    );
  }
  try {
    return NextResponse.json({
      success: true,
      message: "Daily cron job executed successfully...!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cron failed" },
      { status: 500 },
    );
  }
}
