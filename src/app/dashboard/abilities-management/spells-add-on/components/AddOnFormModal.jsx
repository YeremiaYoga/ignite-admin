"use client";

import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const DAMAGE_TYPE_OPTIONS = [
  { label: "Acid", value: "acid" },
  { label: "Bludgeoning", value: "bludgeoning" },
  { label: "Cold", value: "cold" },
  { label: "Fire", value: "fire" },
  { label: "Force", value: "force" },
  { label: "Lightning", value: "lightning" },
  { label: "Necrotic", value: "necrotic" },
  { label: "Piercing", value: "piercing" },
  { label: "Poison", value: "poison" },
  { label: "Psychic", value: "psychic" },
  { label: "Radiant", value: "radiant" },
  { label: "Slashing", value: "slashing" },
  { label: "Thunder", value: "thunder" },
];

const CLASS_OPTIONS = [
  { label: "Artificer", value: "artificer" },
  { label: "Barbarian", value: "barbarian" },
  { label: "Bard", value: "bard" },
  { label: "Blood Hunter", value: "blood_hunter" },
  { label: "Cleric", value: "cleric" },
  { label: "Druid", value: "druid" },
  { label: "Fighter", value: "fighter" },
  { label: "Illrigger", value: "illrigger" },
  { label: "Monk", value: "monk" },
  { label: "Mystic", value: "mystic" },
  { label: "Paladin", value: "paladin" },
  { label: "Ranger", value: "ranger" },
  { label: "Rogue", value: "rogue" },
  { label: "Sorcerer", value: "sorcerer" },
  { label: "Warlock", value: "warlock" },
  { label: "Wizard", value: "wizard" },
];

export default function AddOnFormModal({ spell, field, onClose, onSaved }) {
  const [values, setValues] = useState([]); // Sumber pill, berisi LABEL
  const [tempSelect, setTempSelect] = useState("");
  const [saving, setSaving] = useState(false);

  const OPTIONS = useMemo(() => {
    if (field.key === "damage_type") return DAMAGE_TYPE_OPTIONS;
    if (field.key === "classes") return CLASS_OPTIONS;
    return [];
  }, [field.key]);

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Inisialisasi dari data spell -> konversi ke LABEL
  useEffect(() => {
    if (!spell) return;

    const raw = spell[field.key];
    let arr = [];

    if (Array.isArray(raw)) arr = raw;
    else if (raw != null && raw !== "") arr = [raw];

    const normalized = arr
      .map((v) => String(v).trim())
      .map((v) => {
        const found = OPTIONS.find(
          (o) =>
            o.label.toLowerCase() === v.toLowerCase() ||
            o.value.toLowerCase() === v.toLowerCase()
        );
        // pakai label saja
        return found ? found.label : v;
      });

    setValues(normalized);
  }, [spell, field.key, OPTIONS]);

  if (!spell) return null;

  // opsi yg belum dipilih (pakai label)
  const availableOptions = OPTIONS.filter(
    (opt) => !values.includes(opt.label)
  );

  const addValue = (label) => {
    if (!label) return;
    if (values.includes(label)) return;
    setValues((prev) => [...prev, label]);
    setTempSelect("");
  };

  const removeValue = (label) => {
    setValues((prev) => prev.filter((v) => v !== label));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const body = {
        [field.key]: values.length > 0 ? values : null,
      };

      const res = await fetch(
        `${API}/foundry/spells/${spell.id}/${field.api}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        console.error("Update failed:", await res.text());
        alert("Failed to update");
        return;
      }

      onSaved?.(); // parent: refetch tabel + close modal
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-7">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-100">
            Edit {field.label}{" "}
            <span className="text-blue-400">({spell.name})</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Select */}
        <label className="block text-sm font-medium mb-1">
          {field.label}
        </label>
        <select
          value={tempSelect}
          onChange={(e) => addValue(e.target.value)}
          className="w-full mb-5 rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-gray-100 text-sm"
        >
          <option value="">
            {availableOptions.length === 0
              ? `All ${field.label} selected`
              : `+ Add ${field.label}`}
          </option>
          {availableOptions.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Pills */}
        <p className="text-sm text-gray-400 mb-2">Selected:</p>
        <div className="flex flex-wrap gap-2 min-h-[38px]">
          {values.length === 0 && (
            <span className="text-xs text-gray-500">
              No {field.label} selected
            </span>
          )}

          {values.map((label) => (
            <span
              key={label}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs 
                         bg-blue-700/30 border border-blue-500 text-blue-100"
            >
              {label}
              <button
                onClick={() => removeValue(label)}
                className="hover:text-red-300 text-[11px]"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 text-sm border border-slate-600 rounded-lg hover:bg-slate-800 text-gray-200 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
