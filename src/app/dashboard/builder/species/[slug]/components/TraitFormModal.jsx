"use client";

import { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import RichTextAdvanced from "@/components/RichTextAdvanced";

/**
 * 🔹 TraitFormModal
 * Modal CRUD untuk tabel `species_traits`
 * otomatis kirim `species_id` & `species_name` dari prop `species`
 */
export default function TraitFormModal({ data, species, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    display_order: 0,
    description: "",
    has_options: false,
    options: [],
    scope: "specific",
  });

  const [loading, setLoading] = useState(false);

  /** 🔁 Jika edit mode → isi data */
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        display_order: data.display_order || 0,
        description: data.description || "",
        has_options: data.has_options ?? false,
        options: data.options || [],
        scope: data.scope || "specific",
      });
    } else {
      setForm({
        name: "",
        display_order: 0,
        description: "",
        has_options: false,
        options: [],
        scope: "specific",
      });
    }
  }, [data]);

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  /** 🧩 Manajemen Option */
  const addOption = () => {
    setForm((p) => ({
      ...p,
      options: [...p.options, { name: "", description: "" }],
    }));
  };

  const updateOption = (index, key, value) => {
    const updated = [...form.options];
    updated[index][key] = value;
    setForm((p) => ({ ...p, options: updated }));
  };

  const removeOption = (index) => {
    setForm((p) => ({
      ...p,
      options: p.options.filter((_, i) => i !== index),
    }));
  };

  /** 💾 Save (Create/Update) */
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!species?.id) throw new Error("Invalid species context");

      const payload = {
        ...form,
        species_id: species.id,
        species_name: species.name,
      };

      const method = data ? "PUT" : "POST";
      const url = data
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/trait/${data.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/trait`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();

      alert("✅ Trait saved successfully");
      onSaved?.(result.data || null);
      onClose?.();
    } catch (err) {
      console.error("💥 Save error:", err);
      alert("❌ Failed to save trait");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl space-y-6 relative overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {data ? "Edit Trait" : "Add Trait"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* NAME */}
        <InputField
          label="Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          placeholder="Trait name (e.g. Darkvision)"
        />

        {/* DISPLAY ORDER */}
        <InputField
          label="Display Order"
          type="number"
          value={form.display_order}
          onChange={(v) => handleChange("display_order", Number(v))}
        />

        {/* SCOPE */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Scope</label>
          <select
            value={form.scope}
            onChange={(e) => handleChange("scope", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="specific">Specific (Per Species)</option>
            <option value="generic">Generic (Global)</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">
            Trait Description
          </label>
          <RichTextAdvanced
            value={form.description}
            onChange={(v) => handleChange("description", v)}
            placeholder="Describe what this trait does..."
            rows={8}
          />
        </div>

        {/* TOGGLE OPTIONS */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">Has Options</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.has_options}
              onChange={(e) => handleChange("has_options", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-600 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
          </label>
        </div>

        {/* OPTIONS */}
        {form.has_options && (
          <div className="space-y-3 mt-3 border-t border-gray-700 pt-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-200 font-medium">
                Trait Options
              </h3>
              <button
                onClick={addOption}
                className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-sm rounded text-white"
              >
                + Add Option
              </button>
            </div>

            {form.options.length === 0 && (
              <p className="text-gray-400 text-sm">No options yet.</p>
            )}

            {form.options.map((opt, i) => (
              <div
                key={i}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-sm hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-gray-100">
                    Option #{i + 1}
                  </h4>
                  <button
                    onClick={() => removeOption(i)}
                    className="text-red-400 hover:text-red-500 text-sm flex items-center gap-1"
                    title="Remove this option"
                  >
                    ✕ <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Option Name
                    </label>
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => updateOption(i, "name", e.target.value)}
                      placeholder="e.g. Longsword"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      value={opt.description}
                      onChange={(e) =>
                        updateOption(i, "description", e.target.value)
                      }
                      placeholder="Describe this option..."
                      rows={2}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
