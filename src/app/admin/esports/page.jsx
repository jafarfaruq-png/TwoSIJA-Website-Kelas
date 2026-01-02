"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function EsportMemberPage() {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [esports, setEsports] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    userid: "",
    esportid: "",
    username: "",
    role: "",
    bio: "",
    mvp: false,
  });

  const fetchAll = async () => {
    const { data: m } = await supabase
      .from("esport_member")
      .select("*, esport(name), anggota_kelas(nama)")
      .order("created_at", { ascending: false });

    const { data: u } = await supabase
      .from("anggota_kelas")
      .select("id,nama");

    const { data: e } = await supabase
      .from("esport")
      .select("id,name");

    setMembers(m || []);
    setUsers(u || []);
    setEsports(e || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const submit = async () => {
    if (!form.userid || !form.esportid) {
      alert("User & Esport wajib");
      return;
    }

    if (editId) {
      await supabase
        .from("esport_member")
        .update(form)
        .eq("id", editId);
    } else {
      await supabase.from("esport_member").insert(form);
    }

    resetForm();
    fetchAll();
  };

  const edit = (row) => {
    setEditId(row.id);
    setForm({
      userid: row.userid,
      esportid: row.esportid,
      username: row.username || "",
      role: row.role || "",
      bio: row.bio || "",
      mvp: row.mvp || false,
    });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      userid: "",
      esportid: "",
      username: "",
      role: "",
      bio: "",
      mvp: false,
    });
  };

  const remove = async (id) => {
    if (!confirm("Hapus member?")) return;
    await supabase.from("esport_member").delete().eq("id", id);
    fetchAll();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Member Esport</h1>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        <select
          className="border p-2"
          value={form.userid}
          onChange={(e) => setForm({ ...form, userid: e.target.value })}
        >
          <option value="">Pilih Anggota</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nama}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={form.esportid}
          onChange={(e) => setForm({ ...form, esportid: e.target.value })}
        >
          <option value="">Pilih Tim</option>
          {esports.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Username Game"
          className="border p-2"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Role"
          className="border p-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <textarea
          placeholder="Bio"
          className="border p-2 col-span-2"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.mvp}
            onChange={(e) => setForm({ ...form, mvp: e.target.checked })}
          />
          MVP
        </label>

        <div className="flex gap-2">
          <button
            onClick={submit}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Tambah"}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Tim</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">MVP</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{m.anggota_kelas?.nama}</td>
              <td className="border p-2">{m.esport?.name}</td>
              <td className="border p-2">{m.username}</td>
              <td className="border p-2">{m.role}</td>
              <td className="border p-2">{m.mvp ? "⭐" : "-"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => edit(m)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
