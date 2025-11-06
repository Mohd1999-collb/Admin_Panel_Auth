
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to signin page by default
  //   router.push("/auth/signup");
  // }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600">Redirecting to Sign up...</p>
    </div>
  );
}



