"use client";

import React, { useState } from "react";
import { HomeIcon, UserIcon, Waypoints, Image, Music, UsersIcon, Mail, Gamepad2 } from "lucide-react";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "Home", icon: HomeIcon, href: "#" },
  { label: "About", icon: UserIcon, href: "#about" },
  { label: "Gallery", icon: Image, href: "#gallery" },
  { label: "Struktur Anggota", icon: Waypoints, href: "#struktur" },
  { label: "Anggota Kelas", icon: UsersIcon, href: "#kelas" },
  { label: "Esport", icon: Gamepad2, href: "#esport" },
  { label: "Music", icon: Music, href: "#music" },
  { label: "Testimoni", icon: Mail, href: "#testimoni" },
];

export default function Dock() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-md rounded-full px-6 py-3 flex gap-6 shadow-lg">
        {MENU_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col items-center"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={item.href} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition">
                <Icon className="w-6 h-6 text-gray-800" />
              </Link>
              {hovered === idx && (
                <span className="mt-1 text-xs font-semibold text-gray-800">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
