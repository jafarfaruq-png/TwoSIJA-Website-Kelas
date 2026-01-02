"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 12;

export default function AdminTestimoni() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);

    let query = supabase
      .from("testimoni")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (search.trim()) {
      query = query.or(
        `nama.ilike.%${search}%,pesan.ilike.%${search}%`
      );
    }

    const { data, count, error } = await query;

    if (!error) {
      setData(data || []);
      setTotal(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus testimoni ini?")) return;

    await supabase.from("testimoni").delete().eq("id", id);
    fetchData();
  };

  return (
    <section className="min-h-screen bg-gray-100 px-6 py-14">
      <h1 className="mb-6 text-4xl font-extrabold">
        🛠️ Admin • Testimoni
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari nama atau pesan…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-6 w-full max-w-md rounded-xl border px-4 py-3"
      />

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white shadow-xl">
        <div className="max-h-[520px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Pesan</th>
                <th className="px-4 py-3 text-left">IP</th>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="px-4 py-3 font-semibold">
                    {t.nama}
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    {t.pesan}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {t.ip_address || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Tidak ada testimoni
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <span className="text-sm text-gray-500">
            Total: {total} data
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page * PAGE_SIZE >= total}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
