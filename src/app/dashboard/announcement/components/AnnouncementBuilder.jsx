"use client";

import { useState, useEffect, useMemo } from "react";
import * as Lucide from "lucide-react";
import { RefreshCcw, Plus, Trash2, Pencil } from "lucide-react";
import AnnouncementFormModal from "./AnnouncementFormModal";

const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

// helper ambil token
function getAdminToken() {
  return (
    localStorage.getItem("admin_token") ||
    document.cookie
      ?.split("; ")
      ?.find((r) => r.startsWith("ignite_access_token="))
      ?.split("=")[1] ||
    ""
  );
}

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
      const token = getAdminToken();

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
    const token = getAdminToken();

    await fetch(`${API_BASE}/admin/announcements/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    fetchList();
  };

  // 🔹 helper untuk partial update (active, position, start_at, end_at, dll)
  const patchRow = async (id, patch) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(patch),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("❌ Update failed:", err);
        alert(err.error || "Failed to update announcement");
        return;
      }

      // karena ada logika deactivateOtherAnnouncements di backend,
      // lebih aman reload list dari server
      fetchList();
    } catch (e) {
      console.error("❌ patchRow error:", e);
    }
  };

  const handleToggleActive = (row) => {
    patchRow(row.id, { active: !row.active });
  };

  const handleChangePosition = (row, newPosition) => {
    patchRow(row.id, { position: newPosition });
  };

  const handleChangeStart = (row, value) => {
    // value dari <input type="datetime-local">
    patchRow(row.id, { start_at: value || null });
  };

  const handleChangeEnd = (row, value) => {
    patchRow(row.id, { end_at: value || null });
  };

  const formatDateTimeLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    // biar cocok dengan input datetime-local -> "YYYY-MM-DDTHH:mm"
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
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
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Icon</th>
              <th className="px-3 py-2 text-left">Position</th>
              <th className="px-3 py-2 text-left">Active</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">End</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((r) => {
                const Icon = (r.icon && Lucide[r.icon]) || Lucide.Megaphone;

                return (
                  <tr
                    key={r.id}
                    className="border-t border-gray-800 hover:bg-gray-900/40"
                  >
                    {/* Name */}
                    <td className="px-3 py-2 font-medium text-gray-100">
                      {r.name || <span className="text-gray-500">-</span>}
                    </td>

                    {/* Icon (render lucide langsung) */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-sky-400" style={{ color: r.icon_color }}/>
                        <span className="text-xs text-gray-400" >{r.icon}</span>
                      </div>
                    </td>

                    {/* Position (inline select) */}
                    <td className="px-3 py-2">
                      <select
                        className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs capitalize"
                        value={r.position || "left"}
                        onChange={(e) =>
                          handleChangePosition(r, e.target.value)
                        }
                      >
                        <option value="left">left</option>
                        <option value="right">right</option>
                   
                      </select>
                    </td>

                    {/* Active toggle */}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(r)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          r.active
                            ? "bg-emerald-500"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                            r.active ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Start time (editable) */}
                    <td className="px-3 py-2">
                      <input
                        type="datetime-local"
                        className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-200"
                        value={formatDateTimeLocal(r.start_at)}
                        onChange={(e) =>
                          handleChangeStart(r, e.target.value || null)
                        }
                      />
                    </td>

                    {/* End time (editable) */}
                    <td className="px-3 py-2">
                      <input
                        type="datetime-local"
                        className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-200"
                        value={formatDateTimeLocal(r.end_at)}
                        onChange={(e) =>
                          handleChangeEnd(r, e.target.value || null)
                        }
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingData(r);
                          setForm({
                            ...r,
                            imageFile: null,
                            start_at: formatDateTimeLocal(r.start_at),
                            end_at: formatDateTimeLocal(r.end_at),
                          });
                          setModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-amber-700 hover:bg-amber-600 border border-amber-700 inline-flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(r.id)}
                        className="px-2 py-1 rounded bg-rose-700 hover:bg-rose-600 border border-rose-700 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-gray-400">
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
