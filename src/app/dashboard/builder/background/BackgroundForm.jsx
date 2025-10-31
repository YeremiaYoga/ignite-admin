"use client";

import { useState, useEffect } from "react";
import optionsData from "@/data/bgOptions.json";
import MultipleSelectInput from "./MultipleSelectInput";

export default function BackgroundForm({ mode = "create", initialData = null, onSubmit }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    description: "",
    ability_scores: [],
    feat: "",
    skill_proficiencies: [],
    tool_proficiencies: [],
    languages: "",
    tags: [],
    equipment_options: {},
    feature: "",
    bg_image: null,
  });

  // === Prefill saat edit ===
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        bg_image: null, // biar tidak overwrite image lama
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, bg_image: file }));
  };

  const addUniqueValue = (field, value) => {
    if (!value) return;
    setFormData((prev) => {
      if (prev[field].includes(value)) return prev;
      return { ...prev, [field]: [...prev[field], value] };
    });
  };

  const removeSelected = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((v) => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === "bg_image" && formData.bg_image) {
          data.append(key, formData.bg_image);
        } else if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key]));
        } else if (typeof formData[key] === "object") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }

      const endpoint =
        mode === "edit" && initialData
          ? `${API_BASE}/api/backgrounds/${initialData.id}`
          : `${API_BASE}/api/backgrounds`;

      const res = await fetch(endpoint, {
        method: mode === "edit" ? "PATCH" : "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        alert("❌ Gagal menyimpan background: " + result.message);
        return;
      }

      alert("✅ Background berhasil disimpan!");
      if (onSubmit) onSubmit(result.data);
    } catch (error) {
      console.error("Error submitting background:", error);
      alert("Terjadi error saat menyimpan background.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-lg shadow-lg w-full space-y-6 text-sm"
    >
      {/* === IMAGE PREVIEW === */}
      <div>
        <label className="block mb-1 font-bold">Background Image:</label>
        {formData.bg_image && (
          <img
            src={URL.createObjectURL(formData.bg_image)}
            alt="Preview"
            className="mt-2 w-48 h-48 object-cover rounded"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>

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

      <textarea
        className="w-full h-28 p-2 rounded bg-gray-700"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <MultipleSelectInput
        label="Ability Scores"
        field="ability_scores"
        options={optionsData.abilityScoresOptions}
        values={formData.ability_scores}
        onAdd={addUniqueValue}
        onRemove={removeSelected}
      />

      <MultipleSelectInput
        label="Skill Proficiencies"
        field="skill_proficiencies"
        options={optionsData.skillsOptions}
        values={formData.skill_proficiencies}
        onAdd={addUniqueValue}
        onRemove={removeSelected}
      />

      <div>
        <label className="block mb-1 font-bold">Languages</label>
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Languages"
          value={formData.languages}
          onChange={(e) => handleChange("languages", e.target.value)}
        />
      </div>

      <textarea
        className="w-full h-24 p-2 rounded bg-gray-700"
        placeholder="Feature"
        value={formData.feature}
        onChange={(e) => handleChange("feature", e.target.value)}
      />

      <MultipleSelectInput
        label="Tags"
        field="tags"
        options={optionsData.tagsOptions}
        values={formData.tags}
        onAdd={addUniqueValue}
        onRemove={removeSelected}
      />

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 rounded font-bold hover:bg-green-700"
      >
        {mode === "edit" ? "Update" : "Save"}
      </button>
    </form>
  );
}
