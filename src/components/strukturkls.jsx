"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import AOS from "aos";
import "aos/dist/aos.css";

const classes = ["X", "XI", "XII", "XIII"];

const Box = ({ title, name }) => (
  <div
    className="min-w-[170px] rounded-xl border bg-white px-4 py-3 text-center shadow-sm"
    data-aos="fade-up"
  >
    <p className="text-xs font-semibold text-gray-500">{title}</p>
    <p className="mt-1 text-sm font-medium text-gray-800">
      {name || "-"}
    </p>
  </div>
);

export default function StrukturKelas() {
  const [active, setActive] = useState("X");
  const [data, setData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const fetchData = async (kelas) => {
    const { data: d } = await supabase
      .from("struktur_kelas")
      .select("*")
      .eq("kelas", kelas)
      .order("id", { ascending: true });

    setData(d || []);
  };

  useEffect(() => {
    fetchData(active);
  }, [active]);

  const getName = (jabatan) =>
    data.find((r) => r.jabatan === jabatan)?.nama;

  const hasData = data.length > 0;

  return (
    <section id="struktur" className="min-h-screen bg-gray-50 px-6 py-16">
      {/* TITLE */}
      <div className="mb-10 text-center" data-aos="fade-down">
        <h1 className="text-3xl font-bold">Struktur Kelas</h1>
        <p className="mt-2 text-gray-500">
          Pilih kelas untuk melihat struktur organisasi
        </p>
      </div>

      {/* TABS */}
      <div className="mb-14 flex justify-center gap-2" data-aos="fade-up">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setActive(cls)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition",
              active === cls
                ? "bg-black text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            Kelas {cls}
          </button>
        ))}
      </div>

      {hasData ? (
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
          <Box title="Wali Kelas" name={getName("Wali")} />
          <Box title="Ketua Kelas" name={getName("Ketua")} />
          <Box title="Wakil Ketua" name={getName("Wakil")} />

          <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-4">
              <Box title="Sekretaris 1" name={getName("Sekre1")} />
              <Box title="Sekretaris 2" name={getName("Sekre2")} />
            </div>
            <div className="flex flex-col items-center gap-4">
              <Box title="Bendahara 1" name={getName("Bend1")} />
              <Box title="Bendahara 2" name={getName("Bend2")} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex h-96 items-center justify-center text-4xl font-bold text-gray-400"
          data-aos="zoom-in"
        >
          Coming Soon
        </div>
      )}
    </section>
  );
}
