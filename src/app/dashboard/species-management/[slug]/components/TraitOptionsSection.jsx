"use client";

import { useMemo, useState, useEffect } from "react";
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
  const [traitModifiers, setTraitModifiers] = useState([]);
  const [loadingModifiers, setLoadingModifiers] = useState(true);

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

  // 🔹 Fetch daftar modifier global
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

  // 🔹 Tambahkan modifier baru ke option tertentu
  const addOptionModifier = (optIndex) => {
    const newOptions = [...form.options];
    const mods = newOptions[optIndex].modifiers || [];
    mods.push({
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
    });
    newOptions[optIndex].modifiers = mods;
    onChange("options", newOptions);
  };

  const updateOptionModifier = (optIndex, modIndex, field, value) => {
    const newOptions = [...form.options];
    newOptions[optIndex].modifiers[modIndex][field] = value;
    onChange("options", newOptions);
  };

  const removeOptionModifier = (optIndex, modIndex) => {
    const newOptions = [...form.options];
    newOptions[optIndex].modifiers.splice(modIndex, 1);
    onChange("options", newOptions);
  };

  const toggleHasModifiers = (optIndex, value) => {
    const newOptions = [...form.options];
    newOptions[optIndex].has_modifiers = value;
    if (!value) newOptions[optIndex].modifiers = []; // hapus jika toggle off
    onChange("options", newOptions);
  };

  return (
    <div className="space-y-3 mt-3 border-t border-gray-700 pt-3">
      {/* TOGGLE HAS OPTIONS */}
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
              className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-sm space-y-4"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-semibold text-gray-100">
                  Option #{i + 1}
                </h4>
                <button
                  onClick={() => removeOption(i)}
                  className="text-red-400 hover:text-red-500 text-sm flex items-center gap-1"
                >
                  ✕ <span className="hidden sm:inline">Remove</span>
                </button>
              </div>

              {/* FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  label="Option Name"
                  value={opt.name}
                  onChange={(v) => updateOption(i, "name", v)}
                  placeholder="e.g. Fire Affinity"
                />

                <InputField
                  type="textarea"
                  label="Description"
                  value={opt.description}
                  onChange={(v) => updateOption(i, "description", v)}
                  placeholder="Describe this option..."
                  rows={2}
                />

                <InputField
                  type="selectSearch"
                  label="Prerequisite Trait Option"
                  value={
                    opt.prerequisite_id
                      ? { id: opt.prerequisite_id, name: opt.prerequisite_name }
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

              {/* 🔘 TOGGLE HAS_MODIFIERS */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-300">
                  Has Modifiers for this Option
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={opt.has_modifiers || false}
                    onChange={(e) => toggleHasModifiers(i, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </div>

              {/* 🎯 MODIFIER SECTION */}
              {opt.has_modifiers && (
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-300">
                      Modifiers
                    </span>
                    <button
                      onClick={() => addOptionModifier(i)}
                      className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white text-xs"
                    >
                      + Add Modifier
                    </button>
                  </div>

                  {!opt.modifiers?.length && (
                    <p className="text-gray-500 text-xs">No modifiers yet.</p>
                  )}

                  {opt.modifiers?.map((mod, j) => (
                    <div
                      key={j}
                      className="border border-gray-600 bg-gray-900/50 rounded p-3 mt-2 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-200">
                          Modifier #{j + 1}
                        </span>
                        <button
                          onClick={() => removeOptionModifier(i, j)}
                          className="text-xs text-red-400 hover:text-red-500"
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InputField
                          type="select"
                          label="Modifier Type"
                          value={mod.modifier_type}
                          onChange={(v) =>
                            updateOptionModifier(i, j, "modifier_type", v)
                          }
                          options={traitModifiers.map((m) => ({
                            label: m.name,
                            value: m.slug,
                          }))}
                          placeholder={
                            loadingModifiers
                              ? "Loading..."
                              : "Select modifier type"
                          }
                        />

                        <InputField
                          type="select"
                          label="Modifier Subtype"
                          value={mod.modifier_subtype}
                          onChange={(v) =>
                            updateOptionModifier(i, j, "modifier_subtype", v)
                          }
                          options={
                            traitModifiers
                              .find((tm) => tm.slug === mod.modifier_type)
                              ?.subtypes?.map((s) => ({
                                label: s.name,
                                value: s.slug,
                              })) || []
                          }
                          placeholder={
                            mod.modifier_type
                              ? "Select subtype"
                              : "Select a type first"
                          }
                        />

                        <InputField
                          type="select"
                          label="Ability Score"
                          value={mod.ability_score}
                          onChange={(v) =>
                            updateOptionModifier(i, j, "ability_score", v)
                          }
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
                          onChange={(v) =>
                            updateOptionModifier(i, j, "fixed_value", v)
                          }
                        />

                        <InputField
                          type="number"
                          label="Dice Count"
                          value={mod.dice_count}
                          onChange={(v) =>
                            updateOptionModifier(i, j, "dice_count", v)
                          }
                        />

                        <InputField
                          type="select"
                          label="Die Type"
                          value={mod.die_type}
                          onChange={(v) =>
                            updateOptionModifier(i, j, "die_type", v)
                          }
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
                            updateOptionModifier(
                              i,
                              j,
                              "additional_bonus_types",
                              v
                            )
                          }
                          placeholder="e.g. Damage, Proficiency"
                          className="md:col-span-2"
                        />

                        <InputField
                          type="textarea"
                          label="Details"
                          value={mod.details}
                          onChange={(v) =>
                            updateOptionModifier(i, j, "details", v)
                          }
                          placeholder="Describe modifier effects..."
                          rows={2}
                          className="md:col-span-2"
                        />

                        <div className="md:col-span-2 grid grid-cols-2 gap-2">
                          <InputField
                            type="number"
                            label="Duration Value"
                            value={mod.duration_value}
                            onChange={(v) =>
                              updateOptionModifier(
                                i,
                                j,
                                "duration_value",
                                v
                              )
                            }
                          />
                          <InputField
                            type="select"
                            label="Duration Unit"
                            value={mod.duration_unit}
                            onChange={(v) =>
                              updateOptionModifier(
                                i,
                                j,
                                "duration_unit",
                                v
                              )
                            }
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
          ))}
        </div>
      )}
    </div>
  );
}
