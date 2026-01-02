"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music } from "lucide-react";
import { supabase } from "@/lib/supabase";
import TextType from "./TextType";

import {
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  ScrubBarTrack,
} from "@/components/ui/scrub-bar";

import { BarVisualizer } from "@/components/ui/bar-visualizer";

export default function MusikKelas() {
  const [songs, setSongs] = useState([]);
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(`
          id,
          key,
          title,
          artist,
          audio_url,
          lyrics (
            line_order,
            text,
            typing_speed,
            deleting_speed,
            pause
          )
        `)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      const parsed = data.map((song) => ({
        id: song.id,
        key: song.key,
        title: song.title,
        artist: song.artist,
        src: song.audio_url,
        lyrics: (song.lyrics || [])
          .sort((a, b) => a.line_order - b.line_order)
          .map((l) => ({
            text: l.text,
            typing: l.typing_speed,
            deleting: l.deleting_speed,
            pause: l.pause,
          })),
      }));

      setSongs(parsed);
      setActive(parsed[0]);
    };

    fetchSongs();
  }, []);

  /* ================= PLAY / PAUSE ================= */
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play();
      setPlaying(true);
    }
  };

useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load(); // memaksa load metadata

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => {
      if (!isNaN(audio.duration)) setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [active]);
if (!active) {
  return (
    <section className="min-h-screen flex items-center justify-center text-gray-500">
      Memuat musik...
    </section>
  );
}

  return (
    <section id="music" className="min-h-screen bg-gray-50 px-6 py-16">
      <h1 className="text-center text-5xl font-extrabold">
        Musik Anak Teknik
      </h1>
      <p className="mt-3 text-center text-gray-500">
        Lagu favorit, satu irama satu cerita
      </p>

      {/* TAB SONG */}
      <div className="mt-10 flex justify-center gap-4 flex-wrap">
        {songs.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setActive(s);
              setPlaying(false);
              setCurrentTime(0);
              setDuration(0);
            }}
            className={`rounded-full px-6 py-2 font-medium transition ${
              active.key === s.key
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* PLAYER CARD */}
      <div className="mx-auto mt-14 max-w-5xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="rounded-xl bg-black p-4 text-white">
            <Music size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{active.title}</h3>
            <p className="text-gray-500">{active.artist}</p>
          </div>
          <button
            onClick={togglePlay}
            className="rounded-full bg-black p-4 text-white transition hover:scale-110"
          >
            {playing ? <Pause /> : <Play />}
          </button>
        </div>

        {/* ================= WAVEFORM ================= */}
        <div className="mt-6">
          <BarVisualizer
            state={playing ? "speaking" : "listening"}
            demo={true}
            centerAlign={true}
            barCount={20}
            minHeight={15}
            maxHeight={90}
            className="h-40 max-w-full"
          />
        </div>

        {/* ================= SCRUB BAR ================= */}
        <div className="mt-4 flex w-full max-w-xl mx-auto flex-col items-center gap-4">
          <ScrubBarContainer
            duration={duration || 100}
            value={currentTime}
            onScrub={(val) => {
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            onScrubStart={() => {}}
            onScrubEnd={() => {}}
            className="w-full"
          >
            <ScrubBarTimeLabel time={isNaN(currentTime) ? 0 : Math.floor(currentTime)} className="w-10 text-center" />
            <ScrubBarTrack className="mx-2">
              <ScrubBarProgress />
              <ScrubBarThumb className="bg-black" />
            </ScrubBarTrack>
            <ScrubBarTimeLabel time={isNaN(duration) ? 0 : Math.floor(duration)} className="w-10 text-center" />
          </ScrubBarContainer>
        </div>

        <audio ref={audioRef} src={active.src} />
      </div>

      {/* LYRICS */}
      <div className="mx-auto mt-12 max-w-5xl rounded-3xl bg-white p-10 shadow-lg">
        {playing && active.lyrics.length > 0 && (
          <TextType
            lines={active.lyrics}
            className="text-4xl font-extrabold"
            showCursor
            cursorCharacter="|"
          />
        )}
      </div>
    </section>
  );
}