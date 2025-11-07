"use client";
import React, { useState } from "react";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tooltip, setTooltip] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return showTooltip("All fields are required", "error");
    }

    if (newPassword !== confirmPassword) {
      return showTooltip("New and Confirm Password do not match", "error");
    }

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showTooltip("Password changed successfully ✅", "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showTooltip(data.message || "Something went wrong", "error");
      }
    } catch (error) {
      showTooltip("Internal Server Error", "error");
    }
  };

  const showTooltip = (message: string, type: "success" | "error") => {
    setTooltip({ message, type });
    setTimeout(() => setTooltip({ message: "", type: "" }), 3000);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleUpdatePassword}
        className="relative bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Update Password
        </h2>

        {/* Tooltip Message */}
        {tooltip.message && (
          <div
            className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white text-sm transition-all duration-300 ${
              tooltip.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {tooltip.message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter old password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>  
    </div>
  );
};

export default UpdatePassword;
