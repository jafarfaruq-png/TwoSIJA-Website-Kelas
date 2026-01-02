"use client";

import React from "react";
import { Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/icon-sija.png"
            alt="Logo Sija"
            className="h-10 w-auto object-contain aspect-[16/9]"
          />
          <span className="text-white font-bold text-lg">TwoSIJA</span>
        </div>

        {/* Info Tim */}
        <div className="text-center md:text-left text-sm">
          <p>© {new Date().getFullYear()} All Rights Reserved.</p>
          <p className="text-gray-400">Dikelola oleh Tim IT TwoSIJA</p>
        </div>

        {/* Created by */}
        <div className="text-center md:text-left text-sm">
          <p>
            <span className="font-bold text-white text-base">
              Created by{" "}
              <a
                href="https://jafarfaruq.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-yellow-400 hover:text-yellow-400 transition-colors"
              >
                @jafarfaruq
              </a>
            </span>
          </p>
        </div>

        {/* Sosial Media */}
        <div className="flex gap-4">
          <a
            href="https://instagram.com/jafarfaruq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://twitter.com/jafarfaruq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://github.com/jafarfaruq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>

      {/* Garis bawah */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        TwoSIJA - SMK Negeri Kabuh
      </div>
    </footer>
  );
}
