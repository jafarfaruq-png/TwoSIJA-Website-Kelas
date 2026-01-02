"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MusicAdmin() {
  /* ================= SONG ================= */
  const [songs, setSongs] = useState([]);
  const [activeSong, setActiveSong] = useState(null);

  const [keySong, setKeySong] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [editSongId, setEditSongId] = useState(null);

  /* ================= LYRIC ================= */
  const [lyrics, setLyrics] = useState([]);
  const [showLyricForm, setShowLyricForm] = useState(false);

  const [text, setText] = useState("");
  const [typing, setTyping] = useState(50);
  const [deleting, setDeleting] = useState(20);
  const [pause, setPause] = useState(1000);
  const [editLyricId, setEditLyricId] = useState(null);

  /* ================= FETCH SONG ================= */
  const fetchSongs = async () => {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    setSongs(data || []);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  /* ================= UPLOAD AUDIO ================= */
  const uploadAudio = async (file) => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("music")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("music")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* ================= SONG CRUD ================= */
  const saveSong = async () => {
    if (!keySong || !title) return alert("Key & Title wajib");

    let audioUrl = null;
    if (audioFile) audioUrl = await uploadAudio(audioFile);

    if (editSongId) {
      await supabase
        .from("songs")
        .update({
          key: keySong,
          title,
          artist,
          ...(audioUrl && { audio_url: audioUrl }),
        })
        .eq("id", editSongId);
    } else {
      if (!audioUrl) return alert("Audio wajib diupload");
      await supabase.from("songs").insert({
        key: keySong,
        title,
        artist,
        audio_url: audioUrl,
      });
    }

    resetSongForm();
    fetchSongs();
  };

  const editSong = (song) => {
    setEditSongId(song.id);
    setKeySong(song.key);
    setTitle(song.title);
    setArtist(song.artist || "");
  };

  const deleteSong = async (id) => {
    if (!confirm("Hapus song & lyrics?")) return;
    await supabase.from("songs").delete().eq("id", id);
    setActiveSong(null);
    fetchSongs();
  };

  const resetSongForm = () => {
    setEditSongId(null);
    setKeySong("");
    setTitle("");
    setArtist("");
    setAudioFile(null);
  };

  /* ================= LYRIC ================= */
  const fetchLyrics = async (songId) => {
    const { data } = await supabase
      .from("lyrics")
      .select("*")
      .eq("song_id", songId)
      .order("line_order");

    setLyrics(data || []);
  };

  const selectSong = (song) => {
    setActiveSong(song);
    setShowLyricForm(false);
    resetLyricForm();
    fetchLyrics(song.id);
  };

  const saveLyric = async () => {
    if (!text || !activeSong) return;

    if (editLyricId) {
      await supabase
        .from("lyrics")
        .update({
          text,
          typing_speed: typing,
          deleting_speed: deleting,
          pause,
        })
        .eq("id", editLyricId);
    } else {
      await supabase.from("lyrics").insert({
        song_id: activeSong.id,
        line_order: lyrics.length + 1,
        text,
        typing_speed: typing,
        deleting_speed: deleting,
        pause,
      });
    }

    resetLyricForm();
    setShowLyricForm(false);
    fetchLyrics(activeSong.id);
  };

  const editLyric = (l) => {
    setEditLyricId(l.id);
    setText(l.text);
    setTyping(l.typing_speed);
    setDeleting(l.deleting_speed);
    setPause(l.pause);
    setShowLyricForm(true);
  };

  const deleteLyric = async (id) => {
    if (!confirm("Hapus lirik?")) return;
    await supabase.from("lyrics").delete().eq("id", id);
    fetchLyrics(activeSong.id);
  };

  const resetLyricForm = () => {
    setEditLyricId(null);
    setText("");
    setTyping(50);
    setDeleting(20);
    setPause(1000);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🎵 Music Admin</h1>

      {/* SONG FORM */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold">
          {editSongId ? "Edit Song" : "Tambah Song"}
        </h2>

        <input className="input" placeholder="Key" value={keySong} onChange={e => setKeySong(e.target.value)} />
        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="input" placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} />
        <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} />

        <button onClick={saveSong} className="btn">Simpan Song</button>
      </div>

      {/* SONG LIST */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Daftar Song</h2>
        {songs.map(s => (
          <div key={s.id} className="flex gap-2 mb-1">
            <button onClick={() => selectSong(s)} className="flex-1 text-left">🎧 {s.title}</button>
            <button onClick={() => editSong(s)}>✏️</button>
            <button onClick={() => deleteSong(s.id)}>🗑️</button>
          </div>
        ))}
      </div>

      {/* LYRIC SECTION */}
      {activeSong && (
        <div className="border p-4 rounded space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">🎼 Lyrics — {activeSong.title}</h2>
            {!showLyricForm && (
              <button className="btn" onClick={() => setShowLyricForm(true)}>
                ➕ Tambah Lirik
              </button>
            )}
          </div>

          {/* LIST */}
          {!showLyricForm && lyrics.map((l, i) => (
            <div key={l.id} className="flex gap-2 items-center">
              <span>{i + 1}.</span>
              <span className="flex-1">{l.text}</span>
              <button onClick={() => editLyric(l)}>✏️</button>
              <button onClick={() => deleteLyric(l.id)}>🗑️</button>
            </div>
          ))}

          {/* FORM */}
          {showLyricForm && (
            <div className="space-y-2">
              <textarea className="input" placeholder="Lyric text" value={text} onChange={e => setText(e.target.value)} />
              <div className="flex gap-2">
                <input className="input" type="number" value={typing} onChange={e => setTyping(+e.target.value)} />
                <input className="input" type="number" value={deleting} onChange={e => setDeleting(+e.target.value)} />
                <input className="input" type="number" value={pause} onChange={e => setPause(+e.target.value)} />
              </div>

              <div className="flex gap-2">
                <button className="btn" onClick={saveLyric}>
                  {editLyricId ? "Update Lirik" : "Simpan Lirik"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    resetLyricForm();
                    setShowLyricForm(false);
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
