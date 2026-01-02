"use client";

import React from "react";
import {
    Code2,
    Palette,
    Network,
    GraduationCap,
} from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter"

export default function AboutUs() {
    return (
        <section id="about" className="relative py-24 px-6 md:px-12 bg-gray-50">
            <div className="max-w-6xl mx-auto">

                {/* TITLE */}
                <h2
                    className="text-4xl md:text-5xl font-extrabold text-black text-center mb-6"
                    data-aos="fade-up"
                >
                    About Us
                </h2>

                {/* DESC */}
                <p
                    className="text-neutral-700 text-base md:text-lg text-center max-w-3xl mx-auto mb-16"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    Kami adalah{" "}
  <Highlighter action="underline" color="#FF9800">Angkatan ke-2 Jurusan SIJA</Highlighter>{" "}
                    (<span className="italic">Sistem Informasi Jaringan dan Aplikasi</span>) dari <br></br>
                    <span className="font-semibold">SMK Negeri Kabuh</span>.
                    SIJA merupakan jurusan yang menggabungkan beberapa bidang keahlian
                    teknologi dalam satu kesatuan.
                </p>

                {/* CARD GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* CARD 1 - RPL */}
                    <div
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                        data-aos="fade-up"
                        data-aos-delay="0"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                            <Code2 />
                        </div>
                        <h3 className="text-lg font-bold mb-2">RPL</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Mempelajari pemrograman, pengembangan aplikasi, website, dan
                            sistem berbasis teknologi modern.
                        </p>
                    </div>

                    {/* CARD 2 - DKV */}
                    <div
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                            <Palette />
                        </div>
                        <h3 className="text-lg font-bold mb-2">DKV</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Fokus pada desain grafis, UI/UX, visual branding, serta
                            kreativitas dalam dunia digital.
                        </p>
                    </div>

                    {/* CARD 3 - TKJ */}
                    <div
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                            <Network />
                        </div>
                        <h3 className="text-lg font-bold mb-2">TKJ</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Mempelajari jaringan komputer, server, keamanan jaringan,
                            serta infrastruktur IT.
                        </p>
                    </div>

                    {/* CARD 4 - 4 TAHUN */}
                    <div
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                            <GraduationCap />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Program 4 Tahun</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Masa studi 4 tahun, termasuk 1 tahun PKL, serta berkesempatan
                            mendapatkan gelar <span className="font-medium">D1</span>.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
