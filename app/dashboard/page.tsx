"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegCalendarAlt, FaBlog, FaNewspaper, FaPhotoVideo } from "react-icons/fa";

interface User {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const sections = [
    {
      name: "Event",
      icon: <FaRegCalendarAlt className="text-blue-600 text-3xl" />,
      link: "/dashboard/event",
      color: "from-blue-100 to-blue-200",
    },
    {
      name: "Blog",
      icon: <FaBlog className="text-green-600 text-3xl" />,
      link: "/dashboard/blog",
      color: "from-green-100 to-green-200",
    },
    {
      name: "News",
      icon: <FaNewspaper className="text-yellow-600 text-3xl" />,
      link: "/dashboard/news",
      color: "from-yellow-100 to-yellow-200",
    },
    {
      name: "Gallery",
      icon: <FaPhotoVideo className="text-purple-600 text-3xl" />,
      link: "/dashboard/gallery",
      color: "from-purple-100 to-purple-200",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Dashboard</h1>
        {user && (
          <p className="text-gray-600 mt-2">
            Hello <span className="font-medium">{user.name}</span> 👋
          </p>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.link}
            className={`p-6 bg-gradient-to-br ${section.color} rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              {section.icon}
              <h2 className="text-xl font-semibold text-gray-800">{section.name}</h2>
              <p className="text-sm text-gray-600 text-center">
                Manage all your {section.name.toLowerCase()} content here.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
