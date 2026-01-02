"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ImageCard,
} from "@/components/ui/carousel";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function GalleryPage() {
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [secretCode, setSecretCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // ambil gallery dari Supabase
  const fetchImages = async () => {
    const { data, error } = await supabase.from("gallery_uploads").select("*").order("uploaded_at", { ascending: false });
    if (!error && data) {
      setImages(data.map((img) => img.image_url));
    }
  };

  React.useEffect(() => { fetchImages(); }, []);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => { setCurrent(api.selectedScrollSnap()); });
  }, [api]);

  const handleUpload = async () => {
    if (!file || !secretCode) return alert("File dan secret code wajib diisi!");
    
    // validasi ekstensi
    const allowed = ["image/jpeg","image/jpg","image/png","image/heic"];
    if (!allowed.includes(file.type)) {
      return alert("File harus JPG, JPEG, PNG, atau HEIC!");
    }

    setLoading(true);

    try {
      // cek secret code
      const { data: secretData, error: secretError } = await supabase.from("secret").select("*").eq("code", secretCode).single();
      if (secretError || !secretData) {
        alert("Secret code salah!");
        setLoading(false);
        return;
      }

      // hash nama file
      const ext = file.name.split(".").pop();
      const hashedName = `${crypto.randomUUID()}.${ext}`;

      // upload ke Supabase Storage bucket 'gallery'
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(hashedName, file);

      if (uploadError) {
        alert("Upload gagal: " + uploadError.message);
        setLoading(false);
        return;
      }

      // ambil public URL
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(hashedName);

      // simpan metadata ke tabel gallery_uploads
      await supabase.from("gallery_uploads").insert([{ image_url: publicUrl, uploaded_at: new Date() }]);

      alert("Upload berhasil!");
      setFile(null);
      setSecretCode("");
      setModalOpen(false);
      fetchImages();

    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }

    setLoading(false);
  };

  return (
    <section id="gallery" className="flex min-h-screen flex-col justify-center bg-white">
      <div className="mx-auto max-w-3xl px-6 text-center" data-aos="fade-up" data-aos-duration="800">
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Gallery</h1>
        <p className="mt-2 text-gray-500">Kumpulan dokumentasi & momen terbaik</p>
      </div>

      <div className="mx-auto w-full max-w-6xl" data-aos="zoom-in" data-aos-duration="900">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent className="py-10">
            {images.map((img, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className={cn("mx-2 overflow-hidden border-none bg-white transition-all duration-300", index !== current && "scale-95 opacity-70")}>
                  <CardContent className="p-0"><ImageCard src={img} /></CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="mx-auto mt-6 flex justify-center pb-10" data-aos="fade-up" data-aos-delay="200">
        <Button variant="outline" className="gap-2 border-gray-300 text-black hover:bg-gray-100" onClick={() => setModalOpen(true)}>
          <Upload className="h-4 w-4" /> Upload Gambar
        </Button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-bold mb-4">Upload Gambar</h2>
            <input type="text" placeholder="Secret Code" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} className="w-full mb-4 border p-2 rounded" />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
            <div className="flex justify-end gap-2">
              <Button onClick={handleUpload} disabled={loading} className="bg-blue-500 text-white">{loading ? "Uploading..." : "Upload"}</Button>
              <Button onClick={() => setModalOpen(false)} variant="outline">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
