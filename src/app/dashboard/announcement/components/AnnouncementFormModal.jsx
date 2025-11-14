"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

export default function AnnouncementFormModal({
  open,
  onClose,
  form,
  onChange,
  fetchList,
  data, // row kalau edit, null kalau create
}) {
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const previewUrl =
    form.imageFile ? URL.createObjectURL(form.imageFile) : form.image || "";

  const handleSave = async () => {
    const trimmedName = form.name?.trim();
    if (!trimmedName) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);

      const method = data ? "PUT" : "POST";
      const url = data
        ? `${API_BASE}/admin/announcements/${data.id}`
        : `${API_BASE}/admin/announcements`;

      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("admin_token") ||
            document.cookie
              ?.split("; ")
              ?.find((r) => r.startsWith("ignite_access_token="))
              ?.split("=")[1])) ||
        "";

      const payload = {
        active: form.active ?? true,
        icon: form.icon || "Megaphone",
        name: trimmedName,
        description: form.description || null,
        icon_size: Number(form.icon_size) || 20,
        icon_color: form.icon_color || "#38bdf8",
        position: form.position || "left",
        start_at: form.start_at || new Date().toISOString().slice(0, 16),
        end_at: form.end_at || null,
        image: form.image || null,
        image_size: Number(form.image_size) || 24,
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));
      if (form.imageFile) fd.append("image", form.imageFile);

      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      if (res.ok) {
        alert("✅ Saved successfully");
        await fetchList?.();
        onClose();
      } else {
        const msg = await res.text();
        console.error("❌ Save failed:", msg);
        alert(`❌ Failed: ${msg}`);
      }
    } catch (err) {
      console.error("💥 Save error:", err);
      alert("❌ Error saving data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[90%] max-w-lg p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-gray-100">
            {data ? "Edit Announcement" : "Add Announcement"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-3">
          {/* Name */}
          <label className="flex flex-col text-sm">
            <span className="text-gray-300">Name</span>
            <input
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Announcement title"
              disabled={saving}
            />
          </label>

          {/* Description */}
          <label className="flex flex-col text-sm">
            <span className="text-gray-300">Description</span>
            <input
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Short description (optional)"
              disabled={saving}
            />
          </label>

          {/* Icon + Icon Size + Icon Color + Position */}
          <div className="grid grid-cols-4 gap-3">
            {/* Icon name */}
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Icon</span>
              <input
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={form.icon}
                onChange={(e) => onChange("icon", e.target.value)}
                placeholder="Megaphone"
                disabled={saving}
              />
            </label>

            {/* Icon Size */}
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Icon Size (px)</span>
              <input
                type="number"
                min="8"
                max="128"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={form.icon_size}
                onChange={(e) => onChange("icon_size", e.target.value)}
                placeholder="20"
                disabled={saving}
              />
            </label>

            {/* Icon Color */}
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Icon Color</span>
              <input
                type="color"
                className="bg-gray-800 border border-gray-700 rounded mt-1 h-[38px] cursor-pointer"
                value={form.icon_color || "#38bdf8"}
                onChange={(e) => onChange("icon_color", e.target.value)}
                disabled={saving}
              />
            </label>

            {/* Position */}
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Position</span>
              <select
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={form.position}
                onChange={(e) => onChange("position", e.target.value)}
                disabled={saving}
              >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
              </select>
            </label>
          </div>

          {/* Start + End */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Start At</span>
              <input
                type="datetime-local"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={form.start_at}
                onChange={(e) => onChange("start_at", e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">End At</span>
              <input
                type="datetime-local"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={form.end_at}
                onChange={(e) => onChange("end_at", e.target.value)}
                disabled={saving}
              />
            </label>
          </div>

          {/* Image + Image Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Image (optional)</span>
              <input
                type="file"
                accept="image/*"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-300"
                onChange={(e) =>
                  onChange("imageFile", e.target.files?.[0] || null)
                }
                disabled={saving}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 h-16 w-16 object-cover rounded border border-gray-700"
                />
              )}
            </label>

            <label className="flex flex-col text-sm">
              <span className="text-gray-300">Image Size (px)</span>
              <input
                type="number"
                min="8"
                max="256"
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={form.image_size}
                onChange={(e) => onChange("image_size", e.target.value)}
                placeholder="24"
                disabled={saving}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 disabled:opacity-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 inline-flex items-center gap-2 text-white disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
