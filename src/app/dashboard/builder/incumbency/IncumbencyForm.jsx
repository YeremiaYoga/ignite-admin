"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import InputField from "@/components/InputField";
import AbilityEditor from "./AbilityEditor";
import AssetSelectField from "@/components/AssetSelectField";
import RichTextEditor from "@/components/RichTextEditor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const ALLOWED_TYPES = [
  "Basic",
  "Skill",
  "Talent",
  "Ultimate",
  "Passive",
  "Technique",
];

const ROLE_OPTIONS = [
  "support",
  "tank",
  "debuffer",
  "sustain",
  "shielder",
  "utility",
  "specialist",
  "damage dealer",
  "controller",
  "summoner",
  "bruiser",
];

const DEFAULT_FORM = {
  name: "",
  version: 1,
  image: "",
  good: false,
  neutral: false,
  evil: false,
  unknown: false,
  role: "",
  hp_scale: 0,
  cv_minimum: 0,
  cv_flat_cost: 0,
  cv_percent_cost: 0,
  ac_calc: "",
  intivative_bonus: 0,
  description: "",
  abilities: [],
};

const DEFAULT_ABILITY = () => ({
  visibility: true,
  type: "Basic",
  name: "",
  cost: "Action",
  additional_cost: "",
  type_ability: [],
  image: "",
  description: "",
});

export default function IncumbencyForm({
  initialData,
  mode = "create",
  onSaved,
}) {
  const [form, setForm] = useState(initialData || DEFAULT_FORM);
  const [open, setOpen] = useState({});
  const [saving, setSaving] = useState(false);
  const [baseVersion, setBaseVersion] = useState(null);

  useEffect(() => {
    if (mode === "duplicate" && initialData) {
      const nextVersion = Number(initialData.version || 1) + 1;
      setForm({
        ...initialData,
        version: nextVersion,
      });
      setBaseVersion(Number(initialData.version));
    } else if (initialData) {
      setForm(initialData);
      setBaseVersion(Number(initialData.version));
    } else {
      setForm(DEFAULT_FORM);
      setBaseVersion(null);
    }
  }, [initialData, mode]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateAbility = (idx, key, value) => {
    setForm((prev) => {
      const abilities = [...(prev.abilities || [])];
      abilities[idx] = { ...abilities[idx], [key]: value };
      return { ...prev, abilities };
    });
  };

  const usedTypes = useMemo(() => {
    const abilities = form?.abilities || [];
    return new Set(abilities.map((a) => a.type));
  }, [form]);

  const addAbility = () => {
    const nextType = ALLOWED_TYPES.find((t) => !usedTypes.has(t));
    if (!nextType) return;
    const idx = form.abilities.length;
    setForm((prev) => ({
      ...prev,
      abilities: [...prev.abilities, { ...DEFAULT_ABILITY(), type: nextType }],
    }));
    setOpen((prev) => ({ ...prev, [idx]: true }));
  };

  const removeAbility = (idx) => {
    setForm((prev) => {
      const abilities = prev.abilities.filter((_, i) => i !== idx);
      return { ...prev, abilities };
    });
    setOpen((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const toggleOpen = (idx) => setOpen((p) => ({ ...p, [idx]: !p[idx] }));
  const allTypesUsed = ALLOWED_TYPES.every((t) => usedTypes.has(t));

  const handleSave = async () => {
    try {
      setSaving(true);

      const key = form.key || form.name.toLowerCase().replace(/\s+/g, "_");

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("⚠️ Token hilang, silakan login ulang.");
        return;
      }
      const resCheck = await fetch(`${API_BASE}/api/incumbency/key/${key}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let existing = [];
      if (resCheck.ok) {
        existing = await resCheck.json();
      }

      const match = existing.find(
        (item) => Number(item.version) === Number(form.version)
      );

      let effectiveMode = mode;
      if (mode === "duplicate" && Number(form.version) === baseVersion) {
        effectiveMode = "edit";
        console.log("⚙️ Duplicate version sama → switch ke EDIT mode otomatis");
      }

      const payload = { ...form, key };
      const method = effectiveMode === "edit" || match ? "PATCH" : "POST";
      const url =
        method === "PATCH" && match
          ? `${API_BASE}/api/incumbency/${match.id}`
          : `${API_BASE}/api/incumbency`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      alert(
        method === "PATCH"
          ? `✅ Updated existing version v${form.version}`
          : `✅ Created new version v${form.version}`
      );

      onSaved?.(data);
    } catch (err) {
      console.error("❌ Error saving:", err);
      alert("❌ Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // === UI ===
  return (
    <div className="rounded-2xl p-5 shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={handleSave}
          disabled={saving || !form.name}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            saving || !form.name
              ? "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-400"
              : "border-emerald-700 bg-emerald-600/20 text-emerald-200 hover:bg-emerald-600/30"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold">General</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              placeholder="Name"
            />

            {/* Version control logic */}
            <InputField
              label="Version"
              type="number"
              value={form.version}
              disabled={mode === "edit"}
              onChange={(v) => updateField("version", Number(v))}
              hint={
                mode === "edit"
                  ? "Version cannot be changed during edit."
                  : mode === "duplicate"
                  ? "If version is same as original, it will update instead of create."
                  : undefined
              }
            />

            <div className="md:col-span-2">
              <AssetSelectField
                label="Image URL"
                value={form.image}
                onChange={(v) => updateField("image", v)}
                initialPath=""
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Disposition
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  ["good", "Good"],
                  ["neutral", "Neutral"],
                  ["evil", "Evil"],
                  ["unknown", "Unknown"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      updateField(`alignment_${key}`, !form[`alignment_${key}`])
                    }
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                      form[`alignment_${key}`]
                        ? "border-emerald-700 bg-emerald-600/20 text-emerald-200"
                        : "border-slate-700 bg-slate-800 text-slate-300"
                    }`}
                  >
                    {form[`alignment_${key}`] ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}{" "}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* === Attributes === */}
            <InputField
              label="Role"
              type="select"
              value={form.role}
              onChange={(v) => updateField("role", v)}
              options={ROLE_OPTIONS}
              placeholder="Select role"
            />
            <InputField
              label="HP Scale"
              type="number"
              value={form.hp_scale}
              onChange={(v) => updateField("hp_scale", Number(v))}
            />
            <InputField
              label="CV Minimum"
              type="number"
              value={form.cv_minimum}
              onChange={(v) => updateField("cv_minimum", Number(v))}
            />
            <InputField
              label="CV Flat Cost"
              type="number"
              value={form.cv_flat_cost}
              onChange={(v) => updateField("cv_flat_cost", Number(v))}
            />
            <InputField
              label="CV Percent Cost"
              type="number"
              value={form.cv_percent_cost}
              onChange={(v) => updateField("cv_percent_cost", Number(v))}
            />
            <InputField
              className="md:col-span-2"
              label="AC Calc"
              value={form.ac_calc}
              onChange={(v) => updateField("ac_calc", v)}
              placeholder='e.g. "10 + Dexterity modifier"'
            />
            <InputField
              label="Initiative Bonus"
              type="number"
              value={form.initiative_bonus}
              onChange={(v) => updateField("intivative_bonus", Number(v))}
            />

            {/* === Description === */}
            <div className="md:col-span-2">
              <RichTextEditor
                value={form.description}
                onChange={(v) => updateField("description", v)}
                placeholder="Description"
                rows={10}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Abilities</h3>
            <button
              onClick={addAbility}
              disabled={allTypesUsed}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                allTypesUsed
                  ? "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-400"
                  : "border-emerald-700 bg-emerald-600/20 text-emerald-200 hover:bg-emerald-600/30"
              }`}
            >
              <Plus size={16} /> Add Ability
            </button>
          </div>

          {form.abilities.length === 0 && (
            <p className="text-sm text-slate-400">
              No abilities yet. Click "Add Ability" to start.
            </p>
          )}

          <div className="space-y-3">
            {form.abilities.map((ab, idx) => (
              <AbilityEditor
                key={idx}
                idx={idx}
                data={ab}
                open={!!open[idx]}
                onToggle={() => toggleOpen(idx)}
                onChange={(key, value) => updateAbility(idx, key, value)}
                onRemove={() => removeAbility(idx)}
                usedTypes={usedTypes}
                allowedTypes={ALLOWED_TYPES}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
