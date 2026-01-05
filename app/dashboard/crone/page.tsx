import AppointmentForm from "@/components/AppointmentForm";
import CronStatusCard from "@/components/CronStatusCard";

export default function ChronePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Crone Job</h1>
      <CronStatusCard /> 
    </div>
  );
}