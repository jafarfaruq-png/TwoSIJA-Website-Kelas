"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const menus = [
    {
      label: "Esports",
      icon: "🎮",
      href: "/admin/esports",
    },
    {
      label: "Music",
      icon: "🎵",
      href: "/admin/music",
    },
    {
      label: "Gallery",
      icon: "🖼️",
      href: "/admin/gallery",
    },
    {
      label: "Testimoni",
      icon: "💬",
      href: "/admin/testimonials",
    },
    {
      label: "Member",
      icon: "👥",
      href: "/admin/member",
    },
    {
      label: "Struktur",
      icon: "🏛️",
      href: "/admin/struktur",
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <span className="text-3xl">{menu.icon}</span>
            <span className="font-semibold text-lg">{menu.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
