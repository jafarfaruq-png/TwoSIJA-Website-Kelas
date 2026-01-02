"use client";

import { useEffect, useRef, useState } from "react";

export default function TestimoniPage() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  const fetchData = async () => {
    const res = await fetch("/api/testimoni");
    const json = await res.json();
    setData(json);
    setTimeout(() => {
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, 100);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async () => {
    if (!nama || !pesan) return alert("Lengkapi data");

    setLoading(true);

    const res = await fetch("/api/testimoni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, pesan }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(json.error);
      return;
    }

    setPesan("");
    fetchData();
  };

  return (
    <section className="min-h-screen bg-gray-100 px-6 py-16">
      <h1 className="text-center text-4xl font-extrabold mb-12">
        💬 Testimoni Pengunjung
      </h1>

      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="mb-4 text-xl font-bold">Tulis Testimoni</h2>

          <input
            className="mb-3 w-full rounded border p-3"
            placeholder="Nama kamu"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <textarea
            className="mb-3 w-full rounded border p-3 h-32"
            placeholder="Pesan kamu"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded bg-black py-3 text-white hover:opacity-80"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>

        {/* CHAT */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Testimoni</h2>

          <div
            ref={chatRef}
            className="h-[420px] overflow-y-auto space-y-4 pr-2"
          >
            {data.map((t) => (
              <div
                key={t.id}
                className="max-w-[85%] rounded-xl bg-gray-100 p-4"
              >
                <p className="text-sm font-semibold">{t.nama}</p>
                <p className="text-gray-700">{t.pesan}</p>
                <span className="text-xs text-gray-400">
                  {new Date(t.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
