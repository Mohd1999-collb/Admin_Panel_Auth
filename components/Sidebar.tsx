"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegCalendarAlt, FaBlog, FaNewspaper, FaPhotoVideo } from "react-icons/fa";

const links = [
  { href: "/dashboard/event", label: "Event", icon: <FaRegCalendarAlt /> },
  { href: "/dashboard/blog", label: "Blog", icon: <FaBlog /> },
  { href: "/dashboard/news", label: "News", icon: <FaNewspaper /> },
  { href: "/dashboard/gallery", label: "Gallery", icon: <FaPhotoVideo /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition ${
            pathname === href ? "bg-gray-700" : ""
          }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
