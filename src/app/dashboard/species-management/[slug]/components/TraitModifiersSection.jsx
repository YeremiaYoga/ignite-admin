"use client";

import { useEffect, useState } from "react";
import InputField from "@/components/InputField";

export default function TraitModifiersSection({ form, handleChange, updateModifier }) {
  const [traitModifiers, setTraitModifiers] = useState([]);
  const [loadingModifiers, setLoadingModifiers] = useState(true);

  useEffect(() => {
    const fetchTraitModifiers = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/trait-modifier`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch modifiers");
        const data = await res.json();
        setTraitModifiers(data || []);
      } catch (err) {
        console.error("💥 Error fetching trait modifiers:", err);
      } finally {
        setLoadingModifiers(false);
      }
    };

    fetchTraitModifiers();
  }, []);

  const addModifier = () => {
    handleChange("modifiers", [
      ...(form.modifiers || []),
      {
        modifier_type: "",
        modifier_subtype: "",
        ability_score: "",
        dice_count: "",
        die_type: "",
        fixed_value: "",
        additional_bonus_types: "",
        details: "",
        duration_value: "",
        duration_unit: "",
      },
    ]);
  };

  const removeModifier = (index) => {
    handleChange(
      "modifiers",
      form.modifiers.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="mt-4">
      {/* TOGGLE HAS_MODIFIERS */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">Has Modifiers</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.has_modifiers}
            onChange={(e) => handleChange("has_modifiers", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-600 transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
        </label>
      </div>

      {/* LIST */}
      {form.has_modifiers && (
        <div className="space-y-4 mt-4 border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-gray-200 font-medium">Modifiers</h3>
            <button
              onClick={addModifier}
              className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-sm rounded text-white"
            >
              + Add Modifier
            </button>
          </div>

          {(form.modifiers || []).length === 0 && (
            <p className="text-gray-400 text-sm">No modifiers yet.</p>
          )}

          {(form.modifiers || []).map((mod, i) => (
            <div
              key={i}
              className="border border-gray-700 rounded-lg p-5 bg-gray-800/80 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-semibold text-gray-100">
                  Modifier #{i + 1}
                </h4>
                <button
                  onClick={() => removeModifier(i)}
                  className="text-red-400 hover:text-red-500 text-sm flex items-center gap-1"
                >
                  ✕ <span className="hidden sm:inline">Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  type="select"
                  label="Modifier Type"
                  value={mod.modifier_type}
                  onChange={(v) => {
                    updateModifier(i, "modifier_type", v);
                    updateModifier(i, "modifier_subtype", "");
                  }}
                  options={traitModifiers.map((m) => ({
                    label: m.name,
                    value: m.slug,
                  }))}
                  placeholder={
                    loadingModifiers ? "Loading..." : "Select modifier type"
                  }
                />

                <InputField
                  type="select"
                  label="Modifier Subtype"
                  value={mod.modifier_subtype}
                  onChange={(v) => updateModifier(i, "modifier_subtype", v)}
                  options={
                    traitModifiers
                      .find((tm) => tm.slug === mod.modifier_type)
                      ?.subtypes?.map((s) => ({
                        label: s.name,
                        value: s.slug,
                      })) || []
                  }
                  placeholder={
                    mod.modifier_type ? "Select subtype" : "Select a type first"
                  }
                />

                <InputField
                  type="select"
                  label="Ability Score"
                  value={mod.ability_score}
                  onChange={(v) => updateModifier(i, "ability_score", v)}
                  options={[
                    { label: "—", value: "-" },
                    { label: "STR", value: "STR" },
                    { label: "DEX", value: "DEX" },
                    { label: "CON", value: "CON" },
                    { label: "INT", value: "INT" },
                    { label: "WIS", value: "WIS" },
                    { label: "CHA", value: "CHA" },
                  ]}
                />

                <InputField
                  type="number"
                  label="Fixed Value"
                  value={mod.fixed_value}
                  onChange={(v) => updateModifier(i, "fixed_value", v)}
                />

                <InputField
                  type="number"
                  label="Dice Count"
                  value={mod.dice_count}
                  onChange={(v) => updateModifier(i, "dice_count", v)}
                />

                <InputField
                  type="select"
                  label="Die Type"
                  value={mod.die_type}
                  onChange={(v) => updateModifier(i, "die_type", v)}
                  options={[
                    { label: "—", value: "-" },
                    { label: "d4", value: "d4" },
                    { label: "d6", value: "d6" },
                    { label: "d8", value: "d8" },
                    { label: "d10", value: "d10" },
                    { label: "d12", value: "d12" },
                    { label: "d20", value: "d20" },
                  ]}
                />

                <InputField
                  label="Additional Bonus Types"
                  value={mod.additional_bonus_types}
                  onChange={(v) =>
                    updateModifier(i, "additional_bonus_types", v)
                  }
                  placeholder="e.g. Damage, Proficiency"
                  className="md:col-span-2"
                />

                <InputField
                  type="textarea"
                  label="Details"
                  value={mod.details}
                  onChange={(v) => updateModifier(i, "details", v)}
                  placeholder="Describe modifier effects..."
                  rows={2}
                  className="md:col-span-2"
                />

                <div className="md:col-span-2 grid grid-cols-2 gap-2">
                  <InputField
                    type="number"
                    label="Duration Value"
                    value={mod.duration_value}
                    onChange={(v) => updateModifier(i, "duration_value", v)}
                  />
                  <InputField
                    type="select"
                    label="Duration Unit"
                    value={mod.duration_unit}
                    onChange={(v) => updateModifier(i, "duration_unit", v)}
                    options={[
                      { label: "Rounds", value: "rounds" },
                      { label: "Minutes", value: "minutes" },
                      { label: "Hours", value: "hours" },
                      { label: "Days", value: "days" },
                      { label: "Permanent", value: "permanent" },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
