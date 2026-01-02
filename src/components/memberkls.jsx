"use client";

import React from "react";
import { Instagram, Music2, X as CloseIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ================= KONSTANTA GAME ================= */
const ESPORT = [
  { id: 1, name: "Free Fire" },
  { id: 2, name: "Mobile Legends" },
  { id: 3, name: "Valorant" },
];

/* ================= UTIL WARNA FOTO ================= */
function getAverageColor(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0,
    g = 0,
    b = 0,
    count = 0;

  for (let i = 0; i < data.length; i += 40) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  };
}

/* ================= CARD MEMBER ================= */
function MemberCard({
  member,
  index,
  onOpenModal,
  onOpenKeyModal,
  games,
  onAddGame,
  onEditGame,
  onDeleteGame,
}) {
  const [shadow, setShadow] = React.useState("0 15px 30px rgba(0,0,0,0.15)");
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className="relative rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-2"
      style={{ boxShadow: shadow }}
    >
      {/* MENU */}
      <div className="absolute top-2 right-2 z-50">

        <button
          onClick={() => setShowMenu((p) => !p)}
          className="rounded-full bg-gray-200 px-2"
        >
          •••
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg">
            <button
              onClick={() => {
                setShowMenu(false);
                onOpenKeyModal(member);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Ganti Key
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onOpenModal(member);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Ganti Profil
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onAddGame(member);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Tambah Game
            </button>

            {(games[member.id] || []).map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between px-4 py-1 text-sm"
              >
                <span>
                  {g.esport.name} {g.mvp && "⭐"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditGame(member, g)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteGame(member, g)}
                    className="text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOTO */}
      <div className="mb-4 overflow-hidden rounded-xl">
        <div className="aspect-[3/4]">
          <img
            src={member.image_url}
            alt={member.nama}
            crossOrigin="anonymous"
            onLoad={(e) => {
              const { r, g, b } = getAverageColor(e.target);
              setShadow(`0 20px 40px rgba(${r},${g},${b},0.35)`);
            }}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold">{member.nama}</h3>
      <p className="text-sm italic text-gray-500">“{member.bio}”</p>

      <div className="mt-3 flex gap-2">
        {member.ig_url && (
          <a href={member.ig_url} target="_blank">
            <Instagram size={16} />
          </a>
        )}
        {member.tt_url && (
          <a href={member.tt_url} target="_blank">
            <Music2 size={16} />
          </a>
        )}
      </div>
    </div>
  );
}


/* ================== */
/* MODAL GANTI KEY */
/* ================== */
function KeyModal({ member, onClose }) {
  const [form, setForm] = React.useState({
    oldKey: "",
    newKey: "",
  });

  const handleChangeKey = async () => {
    if (form.oldKey !== member.key) {
      alert("Key lama salah!");
      return;
    }

    const { error } = await supabase
      .from("anggota_kelas")
      .update({ key: form.newKey })
      .eq("id", member.id);

    if (error) alert(error.message);
    else {
      alert("Key berhasil diubah!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-96 rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-3 top-3">
          <CloseIcon size={20} />
        </button>

        <h2 className="mb-4 text-xl font-bold">Ganti Key</h2>

        <input
          type="password"
          placeholder="Key Lama"
          className="mb-2 w-full rounded border px-2 py-1"
          value={form.oldKey}
          onChange={(e) => setForm({ ...form, oldKey: e.target.value })}
        />

        <input
          type="password"
          placeholder="Key Baru"
          className="mb-4 w-full rounded border px-2 py-1"
          value={form.newKey}
          onChange={(e) => setForm({ ...form, newKey: e.target.value })}
        />

        <button
          onClick={handleChangeKey}
          className="w-full rounded bg-black py-2 text-white"
        >
          Simpan Key
        </button>
      </div>
    </div>
  );
}

/* ================== */
/* MODAL EDIT MEMBER */
/* ================== */
function EditModal({ member, onClose, onUpdate }) {
  const [form, setForm] = React.useState({
    bio: member.bio || "",
    ig_url: member.ig_url || "",
    tt_url: member.tt_url || "",
    keyInput: "",
    file: null,
  });

  const handleUpdate = async () => {
    if (form.keyInput !== member.key) {
      alert("Key salah!");
      return;
    }

    let imageUrl = member.image_url;

    if (form.file) {
      const ext = form.file.name.split(".").pop();
      const fileName = `${member.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("member")
        .upload(fileName, form.file, { upsert: true });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      imageUrl = supabase.storage.from("member").getPublicUrl(fileName)
        .data.publicUrl;
    }

    const { error } = await supabase
      .from("anggota_kelas")
      .update({
        bio: form.bio,
        image_url: imageUrl,
        ig_url: form.ig_url,
        tt_url: form.tt_url,
      })
      .eq("id", member.id);

    if (error) alert(error.message);
    else {
      onUpdate(member.id, {
        bio: form.bio,
        image_url: imageUrl,
        ig_url: form.ig_url,
        tt_url: form.tt_url,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-96 rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute right-3 top-3">
          <CloseIcon size={20} />
        </button>

        <h2 className="mb-4 text-xl font-bold">Edit Member</h2>

        <textarea
          className="mb-2 w-full rounded border px-2 py-1"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <input
          type="file"
          className="mb-2 w-full"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
        />

        <input
          className="mb-2 w-full rounded border px-2 py-1"
          placeholder="Instagram URL"
          value={form.ig_url}
          onChange={(e) => setForm({ ...form, ig_url: e.target.value })}
        />

        <input
          className="mb-2 w-full rounded border px-2 py-1"
          placeholder="TikTok URL"
          value={form.tt_url}
          onChange={(e) => setForm({ ...form, tt_url: e.target.value })}
        />

        <input
          type="password"
          className="mb-4 w-full rounded border px-2 py-1"
          placeholder="Key"
          value={form.keyInput}
          onChange={(e) => setForm({ ...form, keyInput: e.target.value })}
        />

        <button
          onClick={handleUpdate}
          className="w-full rounded bg-black py-2 text-white"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}

/* ================= KEY GAME MODAL ================= */
function KeyGameModal({ onSubmit, onClose }) {
  const [keyInput, setKeyInput] = React.useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-80 rounded bg-white p-5">
        <h2 className="mb-3 text-lg font-bold">Masukkan Key</h2>

        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="mb-3 w-full rounded border p-2"
          placeholder="Key"
        />

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(keyInput)}
            className="flex-1 rounded bg-black py-2 text-white"
          >
            Lanjut
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded bg-gray-300 py-2"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= GAME MODAL ================= */
function GameModal({ member, game, onClose, onRefresh }) {
  const [form, setForm] = React.useState({
    esportid: game?.esportid || "",
    username: game?.username || "",
    gameid: game?.gameid || "",
    role: game?.role || "",
    bio: game?.bio || "",
    mvp: game?.mvp || false,
  });

  const isEdit = Boolean(game);

  const handleSubmit = async () => {
    if (!form.esportid || !form.username || !form.gameid) {
      alert("Data wajib diisi");
      return;
    }

    if (!isEdit) {
      const { data } = await supabase
        .from("esport_member")
        .select("id")
        .eq("userid", member.id)
        .eq("esportid", form.esportid)
        .maybeSingle();

      if (data) return alert("Game sudah ada");
    }

    const payload = {
      userid: member.id,
      esportid: form.esportid,
      username: form.username,
      gameid: form.gameid,
      role: form.role,
      bio: form.bio,
      mvp: form.mvp,
    };

    const query = isEdit
      ? supabase.from("esport_member").update(payload).eq("id", game.id)
      : supabase.from("esport_member").insert(payload);

    const { error } = await query;
    if (error) return alert(error.message);

    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded bg-white p-6">
        <h2 className="mb-3 font-bold">
          {isEdit ? "Edit Game" : "Tambah Game"}
        </h2>

        {!isEdit && (
          <select
            className="mb-2 w-full border p-1"
            value={form.esportid}
            onChange={(e) =>
              setForm({ ...form, esportid: Number(e.target.value) })
            }
          >
            <option value="">Pilih Game</option>
            {ESPORT.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        )}

        {["username", "gameid", "role"].map((f) => (
          <input
            key={f}
            className="mb-2 w-full border p-1"
            placeholder={f}
            value={form[f]}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        ))}

        <textarea
          className="mb-2 w-full border p-1"
          placeholder="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <label className="flex gap-2 mb-3">
          <input
            type="checkbox"
            checked={form.mvp}
            onChange={(e) => setForm({ ...form, mvp: e.target.checked })}
          />
          MVP
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 rounded bg-black py-2 text-white"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded bg-gray-300 py-2"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= PARENT ================= */
export default function MemberKls() {
  const [members, setMembers] = React.useState([]);
  const [editingMember, setEditingMember] = React.useState(null);
  const [keyMember, setKeyMember] = React.useState(null);
  const [games, setGames] = React.useState({});
  const [gameMember, setGameMember] = React.useState(null);
  const [editGame, setEditGame] = React.useState(null);
  const [needKey, setNeedKey] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState(null);
  const [keyTargetMember, setKeyTargetMember] = React.useState(null);

  const verifyKey = async (inputKey) => {
    if (!keyTargetMember || !pendingAction) return;

    const { data } = await supabase
      .from("anggota_kelas")
      .select("id")
      .eq("id", keyTargetMember.id)
      .eq("key", inputKey)
      .maybeSingle();

    if (!data) return alert("Key salah");

    setNeedKey(false);

    const action = pendingAction;
    setPendingAction(null);
    setKeyTargetMember(null);

    action();
  };

  const fetchGames = async () => {
    const { data } = await supabase
      .from("esport_member")
      .select("*, esport(name)");
    const map = {};
    data?.forEach((i) => {
      if (!map[i.userid]) map[i.userid] = [];
      map[i.userid].push(i);
    });
    setGames(map);
  };

  React.useEffect(() => {
    supabase
      .from("anggota_kelas")
      .select("*")
      .order("nama")
      .then(({ data }) => setMembers(data || []));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {members.map((m, i) => (
          <MemberCard
            key={m.id}
            member={m}
            index={i}
            onOpenModal={setEditingMember}
            onOpenKeyModal={setKeyMember}
            games={games}
            onAddGame={(member) => {
              setKeyTargetMember(member);
              setPendingAction(() => () => {
                setGameMember(member);
                setEditGame(null);
              });
              setNeedKey(true);
            }}
            onEditGame={(member, game) => {
              setKeyTargetMember(member);
              setPendingAction(() => () => {
                setGameMember(member);
                setEditGame(game);
              });
              setNeedKey(true);
            }}
            onDeleteGame={(member, game) => {
              setKeyTargetMember(member);
              setPendingAction(() => async () => {
                await supabase
                  .from("esport_member")
                  .delete()
                  .eq("id", game.id);
                fetchGames();
              });
              setNeedKey(true);
            }}
          />
        ))}
      </div>

      {editingMember && (
        <EditModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdate={(id, data) =>
            setMembers((p) =>
              p.map((m) => (m.id === id ? { ...m, ...data } : m))
            )
          }
        />
      )}

      {keyMember && (
        <KeyModal member={keyMember} onClose={() => setKeyMember(null)} />
      )}

      {needKey && (
        <KeyGameModal
          onSubmit={verifyKey}
          onClose={() => {
            setNeedKey(false);
            setPendingAction(null);
            setKeyTargetMember(null);
          }}
        />
      )}

      {gameMember && (
        <GameModal
          member={gameMember}
          game={editGame}
          onClose={() => {
            setGameMember(null);
            setEditGame(null);
          }}
          onRefresh={fetchGames}
        />
      )}
    </section>
  );
}
