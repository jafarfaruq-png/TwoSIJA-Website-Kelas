"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AnggotaPage() {
  const [data, setData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    nama: "",
    bio: "",
    key: "",
    image_url: "",
    ig_url: "",
    tt_url: "",
  });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("anggota_kelas")
      .select("*")
      .order("nama");

    if (!error) setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadImage = async () => {
    if (!imageFile) return form.image_url;

    const ext = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${ext}`;
    const filePath = `anggota/${fileName}`;

    const { error } = await supabase.storage
      .from("member")
      .upload(filePath, imageFile);

    if (error) {
      alert("Gagal upload image");
      return null;
    }

    const { data } = supabase.storage
      .from("member")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await uploadImage();
    if (imageUrl === null) return setLoading(false);

    const payload = {
      nama: form.nama,
      bio: form.bio || null,
      key: form.key || null,
      ig_url: form.ig_url || null,
      tt_url: form.tt_url || null,
      image_url: imageUrl || form.image_url || null,
    };

    if (form.id) {
      await supabase.from("anggota_kelas").update(payload).eq("id", form.id);
    } else {
      await supabase.from("anggota_kelas").insert([payload]);
    }

    setForm({
      id: null,
      nama: "",
      bio: "",
      key: "",
      image_url: "",
      ig_url: "",
      tt_url: "",
    });
    setImageFile(null);
    setLoading(false);
    fetchData();
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      nama: row.nama || "",
      bio: row.bio || "",
      key: row.key || "",
      image_url: row.image_url || "",
      ig_url: row.ig_url || "",
      tt_url: row.tt_url || "",
    });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    await supabase.from("anggota_kelas").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Anggota Kelas</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input
          placeholder="Nama"
          className="border p-2 rounded"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {form.image_url && (
          <img
            src={form.image_url}
            alt="preview"
            className="col-span-2 w-32 rounded"
          />
        )}

        <input
          placeholder="Instagram URL"
          className="border p-2 rounded"
          value={form.ig_url}
          onChange={(e) => setForm({ ...form, ig_url: e.target.value })}
        />

        <input
          placeholder="Tiktok URL"
          className="border p-2 rounded"
          value={form.tt_url}
          onChange={(e) => setForm({ ...form, tt_url: e.target.value })}
        />

        <input
          placeholder="Key"
          className="border p-2 rounded"
          value={form.key}
          onChange={(e) => setForm({ ...form, key: e.target.value })}
        />

        <textarea
          placeholder="Bio"
          className="border p-2 rounded col-span-2"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-black text-white p-2 rounded col-span-2"
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
              <th className="border p-2">Bio</th>
              <th className="border p-2">Key</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="border p-2">{row.nama}</td>
                <td className="border p-2">{row.bio}</td>
                <td className="border p-2">{row.key}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}


