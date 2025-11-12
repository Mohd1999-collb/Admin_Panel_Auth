"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Send } from "lucide-react";

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setLoading(false);
      router.push("/dashboard");
    } else alert(data.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
        disabled={loading}
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? (
            <>
            Login.....{`   `}
              <Loader className="inline-block ml-2 animate-spin" size={16} />
            </>
          ) : (
            <>
              Login <Send className="inline-block ml-2" size={16} />
            </>
          )}
        </button>

        {/* Forgot Password link */}
        <p
          onClick={() => router.push("/auth/forgot-password")}
          className="text-blue-600 text-sm text-center cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}

// login email --> talibsidaug1999@gmail.com, password --> 77777
