"use client";

import { useState, useEffect, useMemo } from "react";
import { RefreshCcw, Plus, Trash2, Pencil } from "lucide-react";
import AnnouncementFormModal from "./AnnouncementFormModal";

const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

export default function AnnouncementBuilder() {
  const emptyForm = useMemo(
    () => ({
      active: true,
      icon: "Megaphone",
      name: "",
      description: "",
      icon_size: 20,
      position: "left",
      start_at: new Date().toISOString().slice(0, 16),
      end_at: "",
      image: "",
      imageFile: null,
      image_size: 24,
    }),
    []
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchList = async () => {
    setLoading(true);

    try {
      // const token = localStorage.getItem("admin_token");
      const token = localStorage.getItem("admin_token123");
      const res = await fetch(`${API_BASE}/admin/announcements`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const json = await res.json();
      setRows(json?.data || []);
    } catch (e) {
      console.error("❌ Fetch announcements failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onChange = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const deleteRow = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    const token =
      localStorage.getItem("admin_token") ||
      document.cookie
        ?.split("; ")
        ?.find((r) => r.startsWith("ignite_access_token="))
        ?.split("=")[1] ||
      "";

    await fetch(`${API_BASE}/admin/announcements/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    fetchList();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingData(null);
              setForm(emptyForm);
              setModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-md bg-sky-700 hover:bg-sky-600 border border-sky-600 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={fetchList}
            className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900/70 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left">Active</th>
              <th className="px-3 py-2 text-left">Position</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Icon</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-800 hover:bg-gray-900/40"
                >
                  <td className="px-3 py-2">{String(r.active)}</td>
                  <td className="px-3 py-2 capitalize">{r.position}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.icon}</td>
                  <td className="px-3 py-2">
                    {r.start_at ? new Date(r.start_at).toLocaleString() : "-"}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      // onClick={() => {
                      //   setEditingData(r);
                      //   setForm({ ...r, imageFile: null });
                      //   setModalOpen(true);
                      // }}
                      className="px-2 py-1 rounded bg-amber-700 hover:bg-amber-600 border border-amber-700 inline-flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      // onClick={() => deleteRow(r.id)}
                      className="px-2 py-1 rounded bg-rose-700 hover:bg-rose-600 border border-rose-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-400">
                  No announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnnouncementFormModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        onChange={onChange}
        fetchList={fetchList}
        data={editingData}
      />
    </div>
  );
}
