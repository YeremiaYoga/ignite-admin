"use client";

import { useMemo } from "react";
import InputField from "@/components/InputField";

export default function TraitOptionsSection({
  form,
  onChange,
  addOption,
  updateOption,
  removeOption,
  traits,
  currentTraitId,
}) {
  // 🔹 Ambil semua options dari semua trait selain trait ini sendiri
  const allTraitOptions = useMemo(() => {
    if (!traits?.length) return [];

    return traits.flatMap((trait) => {
      if (trait.id === currentTraitId) return [];
      if (!Array.isArray(trait.options)) return [];

      return trait.options.map((opt) => ({
        label: `${trait.name} — ${opt.name}`,
        value: { id: trait.id || trait.trait_id, name: opt.name },
      }));
    });
  }, [traits, currentTraitId]);

  return (
    <div className="space-y-3 mt-3 border-t border-gray-700 pt-3">
      {/* TOGGLE */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">Has Options</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.has_options}
            onChange={(e) => onChange("has_options", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-600 transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
        </label>
      </div>

      {/* OPTIONS */}
      {form.has_options && (
        <div className="mt-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-gray-200 font-medium">Trait Options</h3>
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
              key={`${i}-${opt.name || "opt"}`}
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
                {/* 🧩 Option Name */}
                <InputField
                  label="Option Name"
                  value={opt.name}
                  onChange={(v) => updateOption(i, "name", v)}
                  placeholder="e.g. Fire Affinity"
                />

                {/* 🧾 Description */}
                <InputField
                  type="textarea"
                  label="Description"
                  value={opt.description}
                  onChange={(v) => updateOption(i, "description", v)}
                  placeholder="Describe this option..."
                  rows={2}
                />

                {/* 🧠 Prerequisite Trait Option */}
                <InputField
                  type="selectSearch"
                  label="Prerequisite Trait Option"
                  value={
                    opt.prerequisite_id
                      ? {
                          id: opt.prerequisite_id,
                          name: opt.prerequisite_name,
                        }
                      : ""
                  }
                  onChange={(v) => {
                    if (v && typeof v === "object") {
                      updateOption(i, "prerequisite_id", v.id);
                      updateOption(i, "prerequisite_name", v.name);
                    } else {
                      updateOption(i, "prerequisite_id", null);
                      updateOption(i, "prerequisite_name", null);
                    }
                  }}
                  options={allTraitOptions}
                  placeholder={
                    allTraitOptions.length
                      ? "Select prerequisite (optional)"
                      : "No available options"
                  }
                  className="md:col-span-2"
                />

                {/* 🎚 Required Character Level */}
                <InputField
                  type="select"
                  label="Required Character Level"
                  value={opt.required_level ?? ""}
                  onChange={(v) =>
                    updateOption(i, "required_level", Number(v))
                  }
                  options={Array.from({ length: 21 }, (_, lvl) => ({
                    label: lvl.toString(),
                    value: lvl,
                  }))}
                  placeholder="Select level (0–20)"
                  className="md:col-span-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
