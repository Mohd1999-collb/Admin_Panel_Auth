"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="font-semibold text-xl">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 cursor-pointer text-white px-4 py-1 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
