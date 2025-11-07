"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/InputField";

export default function SubtypeModal({ modifier, editData, onClose, onSaved }) {
  const [name, setName] = useState(editData?.name || "");
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (editData) setName(editData.name);
  }, [editData]);

  const handleSave = async () => {
    if (!name) return alert("Please enter subtype name");
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `${BASE_URL}/admin/trait-modifier/${modifier.id}/subtype/${editData.slug}`
        : `${BASE_URL}/admin/trait-modifier/${modifier.id}/subtype`;

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
