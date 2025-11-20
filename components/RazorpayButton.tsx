"use client";
import { useState } from "react";

export default function RazorpayButton({ amountInRupees = 100 }) {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<number>(0);

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay SDK failed to load."));
      document.body.appendChild(script);
    });
  };

  const pay = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      const amount = Math.round(payment * 100); // paise
      const res = await fetch("/api/auth/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Order creation failed");

      const order = data.order;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop",
        description: "Purchase description",
        order_id: order.id,
        handler: async function (response: any) {
          await fetch("/api/auth/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          alert("Payment completed — verify server response for success.");
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*Card no. for test  4386 2894 0766 0153	 */}
      <form className="flex flex-col items-center gap-4 bg-yellow-100/80 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-700">Payment Form</h2>

        <input
          type="number"
          placeholder="Enter Amount"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e) => setPayment(Number(e.target.value))}
        />

        <button
          onClick={pay}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md font-medium transition-all duration-300 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Processing…" : `Pay ₹${payment}`}
        </button>
      </form>
    </>
  );
}
