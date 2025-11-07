"use client";

import { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import RichTextAdvanced from "@/components/RichTextAdvanced";
import TraitOptionsSection from "./TraitOptionsSection";
import TraitModifiersSection from "./TraitModifiersSection";

export default function TraitFormModal({ data, species, traits = [], onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    display_order: 0,
    description: "",
    has_options: false,
    options: [],
    has_modifiers: false,
    modifiers: [],
    scope: "generic",
  });

  const [loading, setLoading] = useState(false);

  // 🔁 Populate edit data
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        display_order: data.display_order || 0,
        description: data.description || "",
        has_options: data.has_options ?? false,
        options: data.options || [],
        has_modifiers: data.has_modifiers ?? false,
        modifiers: data.modifiers || [],
        scope: data.scope || "generic",
      });
    } else {
      setForm({
        name: "",
        display_order: 0,
        description: "",
        has_options: false,
        options: [],
        has_modifiers: false,
        modifiers: [],
        scope: "generic",
      });
    }
  }, [data]);

  // 🧩 Generic field change
  const handleChange = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // 🧩 Option management
  const addOption = () =>
    setForm((p) => ({
      ...p,
      options: [
        ...p.options,
        {
          name: "",
          description: "",
          prerequisite_option: "",
          required_level: 0,
        },
      ],
    }));

  const updateOption = (i, key, val) => {
    const updated = [...form.options];
    updated[i][key] = val;
    setForm((p) => ({ ...p, options: updated }));
  };

  const removeOption = (i) =>
    setForm((p) => ({
      ...p,
      options: p.options.filter((_, idx) => idx !== i),
    }));

  // 🧩 Modifier management
  const updateModifier = (i, key, val) => {
    const updated = [...(form.modifiers || [])];
    updated[i][key] = val;
    setForm((p) => ({ ...p, modifiers: updated }));
  };

  // 💾 Save to API
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
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-6xl space-y-6 relative overflow-y-auto max-h-[90vh]">
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

        {/* OPTIONS SECTION */}
         <TraitOptionsSection
          form={form}
          onChange={handleChange}
          addOption={addOption}
          updateOption={updateOption}
          removeOption={removeOption}
          species={species}
          traits={traits} 
          currentTraitId={data?.id}
        />

        {/* MODIFIERS SECTION */}
        <TraitModifiersSection
          form={form}
          handleChange={handleChange}       // ✅ perbaikan: prop namanya sama
          updateModifier={updateModifier}
        />

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
