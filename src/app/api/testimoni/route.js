import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("testimoni")
    .select("id, nama, pesan, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Gagal fetch" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const ua = req.headers.get("user-agent") || "";

  const { nama, pesan } = await req.json();

  if (!nama || !pesan) {
    return NextResponse.json(
      { error: "Nama & pesan wajib" },
      { status: 400 }
    );
  }

  /* ===== RATE LIMIT (1 IP / 30 detik) ===== */
  const { data: last } = await supabase
    .from("testimoni")
    .select("created_at")
    .eq("ip_address", ip)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (last) {
    const diff = Date.now() - new Date(last.created_at).getTime();
    if (diff < 30_000) {
      return NextResponse.json(
        { error: "Terlalu cepat, tunggu 30 detik" },
        { status: 429 }
      );
    }
  }

  const { error } = await supabase.from("testimoni").insert({
    nama,
    pesan,
    ip_address: ip,
    user_agent: ua,
  });

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
