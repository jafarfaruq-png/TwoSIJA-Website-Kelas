"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data galeri
  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery_uploads")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (!error) setGallery(data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Upload gambar
  const handleUpload = async () => {
    if (!file) return alert("Pilih file dulu");

    setLoading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload ke storage
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    // Ambil public URL
    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    // Simpan ke database
    await supabase.from("gallery_uploads").insert({
      image_url: data.publicUrl,
    });

    setFile(null);
    setLoading(false);
    fetchGallery();
  };

  // Hapus galeri
  const handleDelete = async (id, image_url) => {
    if (!confirm("Hapus gambar ini?")) return;

    // Ambil nama file dari URL
    const fileName = image_url.split("/").pop();

    await supabase.storage.from("gallery").remove([fileName]);
    await supabase.from("gallery_uploads").delete().eq("id", id);

    fetchGallery();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Galeri</h1>

      {/* Upload */}
      <div className="flex gap-3 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Tambah Galeri"}
        </button>
      </div>

      {/* List Galeri */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="relative group">
            <img
              src={item.image_url}
              alt="Gallery"
              className="rounded w-full h-40 object-cover"
            />

            <button
              onClick={() => handleDelete(item.id, item.image_url)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


