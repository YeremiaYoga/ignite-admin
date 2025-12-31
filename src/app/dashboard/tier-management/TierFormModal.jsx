"use client";
import { useState } from "react";

export default function TierFormModal({ tier, onClose, onSaved }) {
  const isEdit = !!tier;
  const [form, setForm] = useState({
    name: tier?.name || "",
    description: tier?.description || "",
    is_active: tier?.is_active ?? true,
    is_unlimited: tier?.is_unlimited ?? false,

    // 🔹 semua limit: pakai value dari tier, kalau tidak ada → ""
    character_limit: tier?.character_limit ?? "",
    world_limit: tier?.world_limit ?? "",
    storage_limit: tier?.storage_limit ?? "",
    campaign_limit: tier?.campaign_limit ?? "",
    fvtt_limit: tier?.fvtt_limit ?? "",
    group_limit: tier?.group_limit ?? "",
    era_limit: tier?.era_limit ?? "",
    friend_limit: tier?.friend_limit ?? "",
    journal_limit: tier?.journal_limit ?? "", // ✅ NEW
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const parseLimit = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  };

  async function handleSubmit() {
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/tiers/${tier.id}` : `${API_URL}/tiers`;

      const cleanForm = {
        name: form.name?.trim() || "",
        description: form.description?.trim() || "",
        is_active: !!form.is_active,
        is_unlimited: !!form.is_unlimited,
      };

      if (cleanForm.is_unlimited) {
        // ✅ Unlimited → semua limit null
        cleanForm.character_limit = null;
        cleanForm.world_limit = null;
        cleanForm.storage_limit = null;
        cleanForm.campaign_limit = null;
        cleanForm.fvtt_limit = null;
        cleanForm.group_limit = null;
        cleanForm.era_limit = null;
        cleanForm.friend_limit = null;
        cleanForm.journal_limit = null; // ✅ NEW
      } else {
        cleanForm.character_limit = parseLimit(form.character_limit);
        cleanForm.world_limit = parseLimit(form.world_limit);
        cleanForm.storage_limit = parseLimit(form.storage_limit);
        cleanForm.campaign_limit = parseLimit(form.campaign_limit);
        cleanForm.fvtt_limit = parseLimit(form.fvtt_limit);
        cleanForm.group_limit = parseLimit(form.group_limit);
        cleanForm.era_limit = parseLimit(form.era_limit);
        cleanForm.friend_limit = parseLimit(form.friend_limit);
        cleanForm.journal_limit = parseLimit(form.journal_limit); // ✅ NEW
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(cleanForm),
      });

      const json = await res.json();
      if (json.success) {
        onSaved();
        onClose();
      } else {
        alert(json.error || "Failed to save tier");
      }
    } catch (err) {
      console.error("❌ Save tier error:", err);
      alert("❌ Gagal menyimpan tier");
    }
  }

  const limitsDisabled = form.is_unlimited;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-xl w-[430px] shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
          {isEdit ? "Edit Tier" : "Create New Tier"}
        </h2>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {/* Name */}
          <input
            type="text"
            placeholder="Tier Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
          />

          {/* LIMITS SECTION (Char + lainnya jadi satu) */}
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Limits
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block mb-1">Character</label>
                <input
                  type="number"
                  value={form.character_limit ?? ""}
                  onChange={(e) =>
                    handleChange("character_limit", e.target.value)
                  }
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">World</label>
                <input
                  type="number"
                  value={form.world_limit ?? ""}
                  onChange={(e) => handleChange("world_limit", e.target.value)}
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">Storage</label>
                <input
                  type="number"
                  value={form.storage_limit ?? ""}
                  onChange={(e) =>
                    handleChange("storage_limit", e.target.value)
                  }
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">Campaign</label>
                <input
                  type="number"
                  value={form.campaign_limit ?? ""}
                  onChange={(e) =>
                    handleChange("campaign_limit", e.target.value)
                  }
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">FVTT</label>
                <input
                  type="number"
                  value={form.fvtt_limit ?? ""}
                  onChange={(e) => handleChange("fvtt_limit", e.target.value)}
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">Group</label>
                <input
                  type="number"
                  value={form.group_limit ?? ""}
                  onChange={(e) => handleChange("group_limit", e.target.value)}
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">Era</label>
                <input
                  type="number"
                  value={form.era_limit ?? ""}
                  onChange={(e) => handleChange("era_limit", e.target.value)}
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              <div>
                <label className="block mb-1">Friend</label>
                <input
                  type="number"
                  value={form.friend_limit ?? ""}
                  onChange={(e) => handleChange("friend_limit", e.target.value)}
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>

              {/* ✅ NEW JOURNAL */}
              <div>
                <label className="block mb-1">Journal</label>
                <input
                  type="number"
                  value={form.journal_limit ?? ""}
                  onChange={(e) => handleChange("journal_limit", e.target.value)}
                  className={`w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
                    limitsDisabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={limitsDisabled}
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-2 mt-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_unlimited}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_unlimited: e.target.checked,
                  }))
                }
                className="accent-emerald-600 w-4 h-4"
              />
              <span>Unlimited (no limits)</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="accent-emerald-600 w-4 h-4"
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
