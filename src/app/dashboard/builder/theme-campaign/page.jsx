"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ThemeTable from "./components/ThemeTable";
import ThemeFormModal from "./components/ThemeFormModal";
import ConfirmModal from "@/components/ConfirmModal"; // <- pakai komponenmu

const API =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) || "";

export default function ThemeCampaignPage() {
  const empty = useMemo(() => ({ name: "", description: "", public_creation: false }), []);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null); // { id, name }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") ||
        document.cookie?.split("; ").find(r => r.startsWith("ignite_access_token="))?.split("=")[1] ||
        ""
      : "";

  useEffect(() => {
    fetchThemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/campaign-master/themes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      setRows(json?.data || []);
    } catch (e) {
      console.error("Failed to fetch themes:", e);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (k, v) => setForm(p => ({ ...p, [k]: v }));

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
    const body = {
      name: form.name?.trim(),
      description: form.description || null,
      public_creation: !!form.public_creation,
    };

    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API}/admin/campaign-master/themes/${editing.id}`
      : `${API}/admin/campaign-master/themes`;

    try {
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
        alert((editing ? "Update" : "Create") + " failed\n" + msg);
        return;
      }
      await fetchThemes();     // ✅ refresh dari server
      setOpen(false);
      setEditing(null);
      setForm(empty);
    } catch (e) {
      console.error("save error:", e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // buka confirm modal
  const askDelete = (row) => {
    setToDelete({ id: row.id, name: row.name });
    setConfirmOpen(true);

  };

  // aksi delete (dipanggil oleh ConfirmModal)
  const doDelete = async () => {
    if (!toDelete?.id) return;
    const res = await fetch(`${API}/admin/campaign-master/themes/${toDelete.id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Delete failed");
    }
    await fetchThemes(); // ✅ refresh list
    setToDelete(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Theme Campaign</h2>
        <button
          onClick={openNew}
          className="px-3 py-1.5 rounded-md bg-blue-700 hover:bg-blue-600 border border-blue-600 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <ThemeTable
        data={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={askDelete}  // <- pakai confirm modal
      />

      <ThemeFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        form={form}
        onChange={(k, v) => onChange(k, v)}
        editing={editing}
        isSaving={saving}     // <- kirim flag loading
      />

      {confirmOpen && (
        <ConfirmModal
          title="Delete Theme"
          message={`Are you sure you want to delete "${toDelete?.name}"?\nThis action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          loadingText="Deleting..."
          icon={Trash2}
          onConfirm={doDelete}
          onClose={() => {
            setConfirmOpen(false);
            setToDelete(null);
          }}
        />
      )}
    </div>
  );
}
