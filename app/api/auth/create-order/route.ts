import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();
    const options = {
      amount: amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // 1 = auto-capture
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message || err }, { status: 500 });
  }
}
