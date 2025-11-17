"use client";
import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import InputField from "@/components/InputField";

export default function SubtypeModal({ modifier, editData, onClose, onSaved }) {
  const [name, setName] = useState(editData?.name || "");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]); // ← semua subtype
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Prefill
  useEffect(() => {
    setList(modifier.subtypes || []);
    if (editData) setName(editData.name);
  }, [modifier, editData]);

  // 🔥 Save new or updated subtype
  const handleSave = async () => {
    if (!name.trim()) return alert("Please enter subtype name");

    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `${BASE_URL}/admin/modifiers/${modifier.id}/subtype/${editData.slug}`
        : `${BASE_URL}/admin/modifiers/${modifier.id}/subtype`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Unauthorized — please log in again.");
        throw new Error("Failed to save subtype");
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("❌ Save subtype error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete subtype
  const handleDelete = async (sub) => {
    if (!confirm(`Delete subtype "${sub.name}"?`)) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `${BASE_URL}/admin/modifiers/${modifier.id}/subtype/${sub.slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete subtype");

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("❌ Delete subtype error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {editData ? "Edit Subtype" : "Add Subtype"}{" "}
            <span className="text-gray-400 text-sm">({modifier.name})</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* INPUT */}
        <InputField
          label="Subtype Name"
          value={name}
          onChange={setName}
          placeholder="e.g. Werebears"
        />

        {/* LIST OF SUBTYPES */}
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-sm text-gray-300 mb-2">All Subtypes</h3>

          {list.length === 0 ? (
            <p className="text-xs text-gray-500">No subtypes yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {list.map((s) => (
                <div
                  key={s.slug}
                  className="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded px-3 py-2"
                >
                  <span className="text-gray-100 text-sm">{s.name}</span>

                  <div className="flex gap-2">
                    <button
                      className="text-yellow-400 hover:text-yellow-300"
                      onClick={() => {
                        setName(s.name);
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(s)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-sm text-white rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : editData ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
