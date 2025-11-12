"use client";

import { X, Save } from "lucide-react";

export default function ThemeFormModal({
  open,
  onClose,
  onSubmit,
  form,
  onChange,
  editing,
  isSaving = false, // <- NEW
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[90%] max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold">
            {editing ? "Edit Theme" : "Add Theme"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200" disabled={isSaving}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="flex flex-col text-sm">
            <span className="text-gray-300">Name</span>
            <input
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="The Sin of the Father"
              disabled={isSaving}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="text-gray-300">Description</span>
            <textarea
              rows={4}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Describe the theme…"
              disabled={isSaving}
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.public_creation}
              onChange={(e) => onChange("public_creation", e.target.checked)}
              className="accent-emerald-600"
              disabled={isSaving}
            />
            <span className="text-gray-300">Allow public creation</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 disabled:opacity-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={`px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 inline-flex items-center gap-2 disabled:opacity-60 ${isSaving ? "cursor-wait" : ""}`}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : (editing ? "Update" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
