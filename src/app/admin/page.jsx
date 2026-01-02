"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const menus = [
    {
      label: "Certificates",
      icon: "📄",
      href: "/admin/certificates",
    },
    {
      label: "Skills",
      icon: "🧠",
      href: "/admin/skills",
    },
    {
      label: "Projects",
      icon: "💻",
      href: "/admin/projects",
    },
    {
      label: "Testimonials",
      icon: "💬",
      href: "/admin/testimonials",
    },
  ];

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <ul className="space-y-3">
        {menus.map((menu) => (
          <li key={menu.href}>
            <Link
              href={menu.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition"
            >
              <span className="text-xl">{menu.icon}</span>
              <span className="font-medium">{menu.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
