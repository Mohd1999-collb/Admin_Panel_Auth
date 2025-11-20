import RazorpayButton from "@/components/RazorpayButton";

export default function NewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Payment Gateway Management</h1>
      <RazorpayButton amountInRupees={500} />
    </div>
  );
}
