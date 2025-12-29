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
  { label: "Healing", value: "healing" },
  { label: "Temporary Healing", value: "temporary_healing" },
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
  // values: untuk array fields (classes / damage_type) -> label pills
  const [values, setValues] = useState([]);
  const [tempSelect, setTempSelect] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ homebrew state
  const [homebrewOptions, setHomebrewOptions] = useState([]);
  const [homebrewId, setHomebrewId] = useState(""); // "" = null
  const [loadingHomebrew, setLoadingHomebrew] = useState(false);
  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // OPTIONS untuk fields normal
  const OPTIONS = useMemo(() => {
    if (field.key === "damage_type") return DAMAGE_TYPE_OPTIONS;
    if (field.key === "classes") return CLASS_OPTIONS;
    return [];
  }, [field.key]);

  // ✅ fetch homebrew sources untuk modal homebrew
  useEffect(() => {
    async function fetchHomebrewSources() {
      try {
        setLoadingHomebrew(true);

        const res = await fetch(`${API}/admin/homebrew-sources`, {
          method: "GET",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        const rows = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.items)
          ? json.items
          : Array.isArray(json.sources)
          ? json.sources
          : [];

        rows.sort((a, b) => {
          const ac = String(a.code || "").toLowerCase();
          const bc = String(b.code || "").toLowerCase();
          if (ac && bc) return ac.localeCompare(bc);
          return String(a.name || "").localeCompare(String(b.name || ""));
        });

        setHomebrewOptions(rows);
      } catch (e) {
        console.warn("fetch homebrew sources failed:", e?.message || e);
        setHomebrewOptions([]);
      } finally {
        setLoadingHomebrew(false);
      }
    }

    if (field.key === "homebrew_id") fetchHomebrewSources();
  }, [field.key]);

  useEffect(() => {
    if (!spell) return;

    if (field.key === "homebrew_id") {
      const cur = spell.homebrew_id || spell.homebrewId || "";
      setHomebrewId(cur ? String(cur) : "");
      return;
    }

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
        return found ? found.label : v;
      });

    setValues(normalized);
  }, [spell, field.key, OPTIONS]);

  if (!spell) return null;

  // ====== UI helpers untuk array fields ======
  const availableOptions = OPTIONS.filter((opt) => !values.includes(opt.label));

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

      // ✅ HOME BREW SAVE (PATCH)
      if (field.key === "homebrew_id") {
        const body = { homebrew_id: homebrewId === "" ? null : homebrewId };

        const res = await fetch(
          `${API}/foundry/spells/${spell.id}/homebrew-source`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          console.error("Update homebrew failed:", await res.text());
          alert("Failed to update homebrew");
          return;
        }

        onSaved?.();
        return;
      }

      // ====== default save (PUT) untuk array fields ======
      const body = {
        [field.key]: values.length > 0 ? values : null,
      };

      const res = await fetch(
        `${API}/foundry/spells/${spell.id}/${field.api}`,
        {
          method: field.method || "PUT",
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

      onSaved?.();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };
  function getHomebrewLabelById(id, options = [], loading = false) {
    if (loading) return "Loading homebrew…";
    if (!id) return "-";

    const hb = options.find((o) => String(o.id) === String(id));
    if (!hb) return "Resolving homebrew…";

    return hb.code ? `${hb.code} — ${hb.name || ""}` : hb.name || "-";
  }

  const titleLabel = field?.label || field?.key;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-7">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-100">
            Edit {titleLabel}{" "}
            <span className="text-blue-400">({spell.name})</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* ✅ HOME BREW UI */}
        {field.key === "homebrew_id" ? (
          <>
            <label className="block text-sm font-medium mb-1">
              Homebrew Source
            </label>

            <select
              value={homebrewId}
              onChange={(e) => setHomebrewId(e.target.value)}
              className="w-full mb-5 rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-gray-100 text-sm"
            >
              <option value="">None</option>
              {homebrewOptions.map((hb) => (
                <option key={hb.id} value={hb.id}>
                  {hb.code ? `${hb.code} — ${hb.name || ""}` : hb.name || hb.id}
                </option>
              ))}
            </select>

            <p className="text-xs text-slate-400">
              Current:{" "}
              <span className="text-slate-200">
                {getHomebrewLabelById(
                  homebrewId,
                  homebrewOptions,
                  loadingHomebrew
                )}
              </span>
            </p>
          </>
        ) : (
          <>
            {/* Select (array fields) */}
            <label className="block text-sm font-medium mb-1">
              {titleLabel}
            </label>
            <select
              value={tempSelect}
              onChange={(e) => addValue(e.target.value)}
              className="w-full mb-5 rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-gray-100 text-sm"
            >
              <option value="">
                {availableOptions.length === 0
                  ? `All ${titleLabel} selected`
                  : `+ Add ${titleLabel}`}
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
                  No {titleLabel} selected
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
          </>
        )}

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
