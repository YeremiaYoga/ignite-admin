"use client";

import { useEffect, useState } from "react";
import InputField from "@/components/InputField";

const BASE_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

export default function WorldFormModal({
  open,
  isEdit,
  world,
  form,
  saving,
  onChange,
  onTogglePrivate,
  onClose,
  onSubmit,
}) {
  const [platformOptions, setPlatformOptions] = useState([]);
  const [gameSystemOptions, setGameSystemOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 🔄 Load options from API when modal dibuka
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [platRes, gameRes, langRes] = await Promise.all([
          fetch(`${BASE_URL}/platforms`),
          fetch(`${BASE_URL}/game-systems`),
          fetch(`${BASE_URL}/real-languages`),
        ]);

        if (!platRes.ok) throw new Error("platforms fetch failed");
        if (!gameRes.ok) throw new Error("game systems fetch failed");
        if (!langRes.ok) throw new Error("languages fetch failed");

        const [platData, gameData, langData] = await Promise.all([
          platRes.json(),
          gameRes.json(),
          langRes.json(),
        ]);

        if (cancelled) return;

        // 🎮 Platforms → { value: id, label: name }
        setPlatformOptions(
          (platData || []).map((p) => ({
            value: p.id,
            label: p.name,
            raw: p,
          }))
        );

        // 📚 Game systems → { value: id, label: name }
        setGameSystemOptions(
          (gameData || []).map((g) => ({
            value: g.id,
            label: g.name,
            raw: g,
          }))
        );

        // 🗣 Real languages → { value: id, label: "English (en)" }
        setLanguageOptions(
          (langData || []).map((l) => ({
            value: l.id,
            label: l.code
              ? `${l.name_en || l.name_native || l.code} (${l.code})`
              : l.name_en || l.name_native || "Unknown",
            raw: l,
          }))
        );
      } catch (err) {
        console.error("❌ Failed to load world form options:", err);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-6xl rounded-lg bg-slate-900 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-gray-100">
            {isEdit ? "Edit World" : "Add World"}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-4 py-4 space-y-4">
          {/* Name */}
          <InputField
            label={
              <span className="flex items-center gap-1 text-xs text-gray-300">
                Name <span className="text-red-400">*</span>
              </span>
            }
            value={form.name}
            onChange={(val) =>
              onChange({ target: { name: "name", value: val } })
            }
            placeholder="Tales of Dasaron"
          />

          {/* Short Name */}
          <InputField
            label="Short Name"
            value={form.short_name}
            onChange={(val) =>
              onChange({ target: { name: "short_name", value: val } })
            }
            placeholder="ToD"
          />

          {/* Private toggle + password */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300">Private World</span>
              <button
                type="button"
                onClick={onTogglePrivate}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  form.private ? "bg-emerald-500" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    form.private ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {form.private && (
              <div className="text-right flex-1">
                <InputField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(val) =>
                    onChange({ target: { name: "password", value: val } })
                  }
                  placeholder={
                    isEdit ? "Leave blank to keep current" : "Required"
                  }
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Icon
              </label>
              <input
                type="file"
                name="icon"
                accept="image/*"
                onChange={onChange}
                className="block w-full text-xs text-gray-300 file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-slate-700 file:text-gray-100 hover:file:bg-slate-600"
              />
              {isEdit && world?.icon && (
                <p className="text-[10px] text-gray-500 break-all">
                  Current: {world.icon}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Banner
              </label>
              <input
                type="file"
                name="banner"
                accept="image/*"
                onChange={onChange}
                className="block w-full text-xs text-gray-300 file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-slate-700 file:text-gray-100 hover:file:bg-slate-600"
              />
              {isEdit && world?.banner && (
                <p className="text-[10px] text-gray-500 break-all">
                  Current: {world.banner}
                </p>
              )}
            </div>
          </div>

          {/* Platforms */}
          <InputField
            label={
              <span className="flex items-center gap-1 text-xs text-gray-300">
                Platforms
                {loadingOptions && (
                  <span className="text-[10px] text-gray-400">
                    (loading...)
                  </span>
                )}
              </span>
            }
            type="multiSelectSearch"
            value={form.platforms || []} // array of ids
            onChange={(vals) =>
              onChange({
                target: { name: "platforms", value: vals },
              })
            }
            options={platformOptions}
            placeholder="Search & select platforms..."
          />

          {/* Game Systems */}
          <InputField
            label={
              <span className="flex items-center gap-1 text-xs text-gray-300">
                Game Systems
                {loadingOptions && (
                  <span className="text-[10px] text-gray-400">
                    (loading...)
                  </span>
                )}
              </span>
            }
            type="multiSelectSearch"
            value={form.game_systems || []}
            onChange={(vals) =>
              onChange({
                target: { name: "game_systems", value: vals },
              })
            }
            options={gameSystemOptions}
            placeholder="Search & select game systems..."
          />

          {/* Languages */}
          <InputField
            label={
              <span className="flex items-center gap-1 text-xs text-gray-300">
                Languages
                {loadingOptions && (
                  <span className="text-[10px] text-gray-400">
                    (loading...)
                  </span>
                )}
              </span>
            }
            type="multiSelectSearch"
            value={form.languages || []}
            onChange={(vals) =>
              onChange({
                target: { name: "languages", value: vals },
              })
            }
            options={languageOptions}
            placeholder="Search & select languages..."
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-3 py-1.5 rounded-md border border-slate-600 text-xs text-gray-200 hover:bg-slate-700 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create World"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
