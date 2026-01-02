"use client";

import React, { useState, useEffect } from "react";
import { Flame, Sword, Crosshair, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EsportPage() {
  const [games, setGames] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil data game
      const { data: esportData, error: esportError } = await supabase
        .from("esport")
        .select("*")
        .order("id", { ascending: true });

      if (esportError) return console.error(esportError);

      const gamesWithMembers = await Promise.all(
        esportData.map(async (game) => {
          // Ambil member dari tabel esport_member
          const { data: membersData, error: membersError } = await supabase
            .from("esport_member")
            .select(`
        *,
        anggota_kelas (
          nama,
          image_url
        )
      `)
            .eq("esportid", game.id)
            .order("id", { ascending: true });

          if (membersError) return console.error(membersError);

          const members = membersData.map((m) => ({
            ...m,
            name: m.anggota_kelas?.nama || "Unknown",
            img: m.anggota_kelas?.image_url || "https://picsum.photos/400/600?random",
            bio: m.bio,
            role: m.role,
            mvp: m.mvp,
            username: m.username,
          }));

          return {
            ...game,
            members,
          };
        })
      );


      setGames(gamesWithMembers);
      setActive(gamesWithMembers[0]);
    };

    fetchData();
  }, []);

  if (!active) return <div className="text-center py-20">Loading...</div>;

  return (
    <section id="esport" className="mx-auto max-w-6xl px-4 py-16">
      {/* TITLE */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold">Esport Class</h1>
        <p className="mt-2 text-gray-500">Member kelas yang hobi dan jago ngegame 🎮</p>
      </div>

      {/* TAB GAME */}
      <div className="mb-12 flex justify-center gap-4 flex-wrap">
        {games.map((g) => (
          <button
            key={g.key}
            onClick={() => setActive(g)}
            className={`rounded-full px-6 py-2 font-semibold transition
              ${active.key === g.key
                ? "bg-black text-white"
                : g.color === "yellow"
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : g.color === "blue"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* ACTIVE GAME SECTION */}
      <div>
        {/* BANNER */}
        <div
          className={`relative mb-12 overflow-hidden rounded-3xl shadow-xl
          ${active.color === "yellow"
              ? "shadow-yellow-400/40"
              : active.color === "blue"
                ? "shadow-blue-400/40"
                : "shadow-red-400/40"
            }`}
        >
          <img
            src={active.banner}
            alt={active.name}
            width={1200}
            height={500}
            className="h-[300px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <h2 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
            {active.name}
          </h2>
        </div>

        {/* MEMBER LIST */}
        <div className="overflow-x-auto pb-4">
  <div className="grid grid-flow-col auto-cols-[260px] gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:auto-cols-auto">
    {active.members.map((m, i) => (
      <div
  key={m.id}
  data-aos="fade-up"
  data-aos-delay={i * 80}
  className="relative rounded-2xl bg-white p-4 flex-shrink-0"
  style={{
    boxShadow:
      active.color === "yellow"
        ? "0 10px 20px rgba(253, 224, 71, 0.4)" // kuning
        : active.color === "blue"
        ? "0 10px 20px rgba(59, 130, 246, 0.4)" // biru
        : "0 10px 20px rgba(239, 68, 68, 0.4)", // merah
  }}
>
  {/* FOTO + MVP */}
  <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl">
    <img
      src={m.img}
      alt={m.name}
      className="object-cover h-full w-full"
    />

    {m.mvp && (
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
        <Crown size={14} /> MVP
      </div>
    )}
  </div>

  {/* NAMA & BIO */}
  <h3 className="text-lg font-bold">{m.name}</h3>
  <p className="text-sm text-gray-500">{m.bio}</p>

  {/* INFO TAMBAHAN */}
  <div className="mt-3 text-sm">
    <p>
      <span className="font-semibold">Nickname:</span> {m.username}
    </p>
    <p>
      <span className="font-semibold">ID:</span> {m.gameid}
    </p>
    <p>
      <span className="font-semibold">Role:</span> {m.role}
    </p>
  </div>
</div>

    ))}
  </div>
</div>


      </div>
    </section>
  );
}
