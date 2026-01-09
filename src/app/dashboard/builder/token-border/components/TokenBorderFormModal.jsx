"use client";

import InputField from "@/components/InputField";
import RichTextAdvanced from "@/components/RichTextAdvanced";

export default function TokenBorderFormModal({
  open,
  isEdit,
  viewOnly,
  border,
  form,
  saving,
  onChange,
  onTogglePaid,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  const title = viewOnly
    ? "View Token Border"
    : isEdit
    ? "Edit Token Border"
    : "Add Token Border";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl rounded-lg bg-slate-900 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-4 py-4 space-y-4">
          <InputField
            label={
              <span className="flex items-center gap-1 text-xs text-gray-300">
                Name <span className="text-red-400">*</span>
              </span>
            }
            value={form.name}
            onChange={(val) =>
              onChange({
                target: { name: "name", value: val },
              })
            }
            placeholder="Elegant Golden Frame"
            disabled={viewOnly}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">
              Description
            </label>
            <RichTextAdvanced
              value={form.description || ""}
              onChange={(val) =>
                onChange({
                  target: { name: "description", value: val },
                })
              }
              placeholder="Write description for this border..."
              rows={10}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300">Paid Border</span>
              <button
                type="button"
                onClick={!viewOnly ? onTogglePaid : undefined}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  form.is_paid ? "bg-green-500" : "bg-slate-600"
                } ${viewOnly ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    form.is_paid ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Release Date
              </label>

              <input
                type="date"
                value={form.release_date || ""}
                disabled={viewOnly}
                onChange={(e) =>
                  onChange({
                    target: { name: "release_date", value: e.target.value },
                  })
                }
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">
              Image
            </label>

            {!viewOnly && (
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={onChange}
                className="block w-full text-xs text-gray-300 file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-slate-700 file:text-gray-100 hover:file:bg-slate-600"
              />
            )}

            {(isEdit || viewOnly) && border?.image_url && (
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 rounded-md bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                  <img
                    src={border.image_url}
                    alt={border.name || "border"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[10px] text-gray-500 break-all">
                  Current: {border.image_url}
                </p>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-3 py-1.5 rounded-md border border-slate-600 text-xs text-gray-200 hover:bg-slate-700 disabled:opacity-60"
            >
              {viewOnly ? "Close" : "Cancel"}
            </button>

            {!viewOnly && (
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Token Border"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
