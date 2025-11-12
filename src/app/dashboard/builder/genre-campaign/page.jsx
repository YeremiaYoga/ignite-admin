"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import GenreTable from "./components/GenreTable";
import GenreFormModal from "./components/GenreFormModal";
import ConfirmModal from "@/components/ConfirmModal"; // pastikan path benar

const API =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) || "";

export default function GenreCampaignPage() {
  const empty = useMemo(
    () => ({ name: "", description: "", public_creation: false }),
    []
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") ||
        document.cookie
          ?.split("; ")
          ?.find((r) => r.startsWith("ignite_access_token="))
          ?.split("=")[1] ||
        ""
      : "";

  // 🔹 Load list genre
  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/campaign-master/genres`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      setRows(json?.data || []);
    } catch (err) {
      console.error("❌ Fetch genres error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name ?? "",
      description: row.description ?? "",
      public_creation: !!row.public_creation,
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        name: form.name?.trim(),
        description: form.description || null,
        public_creation: !!form.public_creation,
      };

      const url = editing
        ? `${API}/admin/campaign-master/genres/${editing.id}`
        : `${API}/admin/campaign-master/genres`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("❌ Save error:", msg);
        alert(`Failed: ${msg}`);
        return;
      }

      await fetchGenres(); // langsung refresh list biar datanya pasti up-to-date
      setOpen(false);
      setEditing(null);
      setForm(empty);
    } catch (err) {
      console.error("💥 Save genre error:", err);
      alert("Failed to save genre");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`${API}/admin/campaign-master/genres/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Delete failed: ${msg}`);
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("💥 Delete genre error:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Genre Campaign</h2>
        <button
          onClick={openNew}
          className="px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-600 border border-blue-600 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <GenreTable
        data={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={(row) => setConfirmDelete(row)} // buka modal konfirmasi
      />

      {/* 🔹 Modal Form */}
      <GenreFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        form={form}
        onChange={onChange}
        editing={editing}
        saving={saving}
      />

      {/* 🔹 Modal Konfirmasi Delete */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Genre"
          message={`Are you sure you want to delete "${confirmDelete.name}"?`}
          confirmText="Delete"
          confirmColor="red"
          loadingText="Deleting..."
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => remove(confirmDelete.id)}
        />
      )}
    </div>
  );
}
