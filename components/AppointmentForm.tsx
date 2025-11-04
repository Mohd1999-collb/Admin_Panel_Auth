"use client";

import { useState } from "react";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    doctor: "",
    date: "",
    time: "",
    symptoms: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoading(false);
    setMessage("");

    const res = await fetch("/api/auth/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-sky-700 mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border p-2 rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded-md"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="doctor"
          placeholder="Doctor Name"
          className="w-full border p-2 rounded-md"
          value={formData.doctor}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          className="w-full border p-2 rounded-md"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          className="w-full border p-2 rounded-md"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <textarea
          name="symptoms"
          placeholder="Describe your symptoms"
          className="w-full border p-2 rounded-md"
          value={formData.symptoms}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-md"
        >
          {loading ? "Sending..." : "Confirm Appointment"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
    </div>
  );
}
