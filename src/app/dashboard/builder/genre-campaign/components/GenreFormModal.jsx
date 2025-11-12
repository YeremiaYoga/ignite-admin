"use client";

import { X, Save } from "lucide-react";

export default function GenreFormModal({
  open,
  onClose,
  onSubmit,
  form,
  onChange,
  editing, // row or null
  saving = false, // loading indicator saat save
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[90%] max-w-lg p-6 space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-gray-100">
            {editing ? "Edit Genre" : "Add Genre"}
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-3">
          {/* Name */}
          <label className="flex flex-col text-sm">
            <span className="text-gray-300 mb-1">Name</span>
            <input
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Dark Fantasy"
              disabled={saving}
            />
          </label>

          {/* Description */}
          <label className="flex flex-col text-sm">
            <span className="text-gray-300 mb-1">Description</span>
            <textarea
              rows={4}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Describe the genre..."
              disabled={saving}
            />
          </label>

          {/* Public creation toggle */}
          <label className="inline-flex items-center gap-2 text-sm mt-1">
            <input
              type="checkbox"
              checked={!!form.public_creation}
              onChange={(e) => onChange("public_creation", e.target.checked)}
              className="accent-emerald-600 h-4 w-4"
              disabled={saving}
            />
            <span className="text-gray-300 select-none">
              Allow public creation
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={saving || !form.name?.trim()}
            className={`px-3 py-1.5 rounded-md border border-emerald-600 inline-flex items-center gap-2 text-white transition ${
              saving
                ? "bg-emerald-800 opacity-80 cursor-wait"
                : "bg-emerald-700 hover:bg-emerald-600"
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
