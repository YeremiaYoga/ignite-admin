"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/InputField";

const ALLOWED_TARGETS = [
  "item",
  "magic_item",
  "background",
  "spell",
  "monster",
  "feat",
  "species",
  "subclass",
  "class",
  "trait"
];

function formatLabel(v) {
  if (v === "magic_item") return "Magic Item";
  return v
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TraitModifierFormModal({ data, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    subtypes: [],
    public: false,
    target_for: [],
  });
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // ⬇️ Prefill kalau edit
  useEffect(() => {
    if (data) {
      const targets = Array.isArray(data.target_for || data.for)
        ? (data.target_for || data.for)
        : [];

      setForm({
        name: data.name || "",
        subtypes: data.subtypes || [],
        public: !!data.public,
        target_for: targets,
      });
    } else {
      setForm({
        name: "",
        subtypes: [],
        public: false,
        target_for: [],
      });
    }
  }, [data]);

  const handleChange = (key, val) =>
    setForm((p) => ({
      ...p,
      [key]: val,
    }));

  const handleTogglePublic = () => {
    setForm((p) => ({ ...p, public: !p.public }));
  };

  const handleToggleTarget = (value) => {
    if (value === "all") {
      setForm((p) => ({ ...p, target_for: [...ALLOWED_TARGETS] }));
      return;
    }

    setForm((p) => {
      const current = Array.isArray(p.target_for) ? p.target_for : [];
      const exists = current.includes(value);
      let next;

      if (exists) {
        next = current.filter((v) => v !== value);
      } else {
        next = [...current, value];
      }

      next = Array.from(new Set(next));
      return { ...p, target_for: next };
    });
  };

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        alert("Name is required.");
        return;
      }
      if (!Array.isArray(form.target_for) || form.target_for.length === 0) {
        alert("Please select at least one target.");
        return;
      }

      setLoading(true);
      const method = data ? "PUT" : "POST";
      const url = data
        ? `${BASE_URL}/admin/modifiers/${data.id}`
        : `${BASE_URL}/admin/modifiers`;

      const token = localStorage.getItem("admin_token");

      const payload = {
        name: form.name,
        subtypes: form.subtypes || [],
        public: !!form.public,
        target_for: form.target_for, // 🔹 langsung pakai target_for
      };

      console.log("📤 FRONTEND payload:", payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized — please log in again.");
        }
        throw new Error("Failed to save modifier.");
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("❌ Save modifier error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled =
    loading ||
    !form.name.trim() ||
    !Array.isArray(form.target_for) ||
    form.target_for.length === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-white">
            {data ? "Edit Modifier" : "Add Modifier"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <InputField
          label="Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          placeholder="Modifier name (e.g. Favored Enemy)"
        />

        {/* Public Toggle */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-gray-200">Public</span>
          <button
            type="button"
            onClick={handleTogglePublic}
            className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-pressed={form.public}
          >
            <span
              className={`absolute inset-0 rounded-full transition-colors ${
                form.public ? "bg-emerald-500" : "bg-gray-600"
              }`}
            ></span>
            <span
              className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                form.public ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Target For (multi-select) */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-200">
              Target For
            </label>
            <button
              type="button"
              onClick={() => handleToggleTarget("all")}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              Select All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            {ALLOWED_TARGETS.map((value) => {
              const checked = form.target_for?.includes(value);
              return (
                <label
                  key={value}
                  className={`flex items-center gap-2 px-2 py-1 rounded border text-xs cursor-pointer transition ${
                    checked
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() => handleToggleTarget(value)}
                  />
                  <span
                    className={`h-3 w-3 rounded-sm border ${
                      checked
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-500"
                    }`}
                  />
                  <span className="text-gray-100">
                    {formatLabel(value)}
                  </span>
                </label>
              );
            })}
          </div>

          {(!form.target_for || form.target_for.length === 0) && (
            <p className="text-xs text-red-400 mt-1">
              Please select at least one target.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`px-4 py-2 text-sm rounded text-white ${
              isSaveDisabled
                ? "bg-emerald-900/60 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
