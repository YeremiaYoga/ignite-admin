"use client";

import { useState, useEffect } from "react";
import optionsData from "@/data/featsOptions.json";
import MultipleSelectInput from "./MultipleSelectInput";

export default function FeatForm({ mode = "create", initialData, onSaved }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    feat: "",
    notes: "",
    description: "",
    tags: [],
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        mode === "edit"
          ? `${API_BASE}/api/feats/${formData.id}`
          : `${API_BASE}/api/feats`;
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save feat");

      alert("Feat saved successfully!");
      if (onSaved) onSaved(result.data);
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-lg shadow-lg space-y-5"
    >
      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Source"
        value={formData.source}
        onChange={(e) => handleChange("source", e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Feat (contoh: Origin Feat)"
        value={formData.feat}
        onChange={(e) => handleChange("feat", e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
      />

      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          className="w-full p-2 rounded bg-gray-700 h-40 resize-y"
          placeholder="Enter full feat description..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <MultipleSelectInput
        label="Tags"
        field="tags"
        options={optionsData.tagsOptions}
        values={formData.tags}
        onAdd={(field, value) =>
          handleChange("tags", [...formData.tags, value])
        }
        onRemove={(field, value) =>
          handleChange(
            "tags",
            formData.tags.filter((v) => v !== value)
          )
        }
      />

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
      >
        {mode === "edit" ? "Update" : "Save"}
      </button>
    </form>
  );
}
