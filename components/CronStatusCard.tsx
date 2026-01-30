export default function CronStatusCard() {
  return (
    <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">
        Daily Cron Job
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Runs automatically every day at 12:00 AM
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          Active
        </span>
        <span className="text-xs text-gray-500">
          Managed by Vercel
        </span>
      </div>
    </div>
  );
}
