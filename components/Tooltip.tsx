"use client";
import { useEffect, useState } from "react";

interface TooltipProps {
  message: string;
  type?: "success" | "error" | "info";
}

export default function Tooltip({ message, type = "info" }: TooltipProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-6 right-6 text-white px-4 py-2 rounded shadow-lg transition-all duration-300 ${colors[type]} z-50`}
    >
      {message}
    </div>
  );
}
