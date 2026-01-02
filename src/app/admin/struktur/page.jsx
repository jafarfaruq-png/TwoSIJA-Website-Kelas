"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StrukturKelasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    nama: "",
    jabatan: "",
    kelas: "",
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("struktur_kelas")
      .select("*")
      .order("kelas", { ascending: true });

    if (!error) setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nama: form.nama,
      jabatan: form.jabatan,
      kelas: form.kelas,
    };

    if (form.id) {
      // UPDATE
      await supabase
        .from("struktur_kelas")
        .update(payload)
        .eq("id", form.id);
    } else {
      // INSERT
      await supabase
        .from("struktur_kelas")
        .insert([payload]);
    }

    setForm({
      id: null,
      nama: "",
      jabatan: "",
      kelas: "",
    });

    setLoading(false);
    fetchData();
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      nama: row.nama || "",
      jabatan: row.jabatan || "",
      kelas: row.kelas || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    await supabase.from("struktur_kelas").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Struktur Kelas</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
        <input
          placeholder="Nama"
          className="border p-2 rounded"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
        />

        <input
          placeholder="Jabatan"
          className="border p-2 rounded"
          value={form.jabatan}
          onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
          required
        />

        <input
          placeholder="Kelas"
          className="border p-2 rounded"
          value={form.kelas}
          onChange={(e) => setForm({ ...form, kelas: e.target.value })}
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white p-2 rounded col-span-3"
        >
          {loading ? "Loading..." : form.id ? "Update" : "Tambah"}
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Jabatan</th>
              <th className="border p-2">Kelas</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="border p-2">{row.nama}</td>
                <td className="border p-2">{row.jabatan}</td>
                <td className="border p-2">{row.kelas}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

