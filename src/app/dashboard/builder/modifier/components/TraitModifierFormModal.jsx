"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/InputField";

export default function TraitModifierFormModal({ data, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", subtypes: [] });
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

const handleSave = async () => {
  try {
    setLoading(true);
    const method = data ? "PUT" : "POST";
    const url = data
      ? `${BASE_URL}/admin/trait-modifier/${data.id}`
      : `${BASE_URL}/admin/trait-modifier`;

    const token = localStorage.getItem("admin_token"); // ✅ ambil token admin

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // ✅ kirim token
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      if (res.status === 401)
        throw new Error("Unauthorized — please log in again.");
      throw new Error("Failed to save modifier.");
    }

    onSaved();
    onClose();
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {data ? "Edit Modifier" : "Add Modifier"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <InputField
          label="Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          placeholder="Modifier name (e.g. Favored Enemy)"
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
