"use client";
import { useState, useEffect } from "react";

export default function TierFormModal({ tier, onClose, onSaved }) {
  const isEdit = !!tier;
  const [form, setForm] = useState({
    name: tier?.name || "",
    character_limit: tier?.character_limit || "",
    description: tier?.description || "",
    is_active: tier?.is_active ?? true,
    is_unlimited: tier?.is_unlimited ?? false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🧠 Auto set null if unlimited unchecked
  useEffect(() => {
    if (!form.is_unlimited && form.character_limit === "") {
      setForm((prev) => ({ ...prev, character_limit: null }));
    }
  }, [form.is_unlimited]);

  async function handleSubmit() {
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_URL}/tiers/${tier.id}`
        : `${API_URL}/tiers`;

      // 🔧 Bersihkan data sebelum dikirim
      const cleanForm = {
        ...form,
        character_limit:
          form.is_unlimited || form.character_limit === ""
            ? null
            : Number(form.character_limit),
      };

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-xl w-[400px] shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
          {isEdit ? "Edit Tier" : "Create New Tier"}
        </h2>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Tier Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <input
            type="number"
            placeholder="Character Limit"
            value={form.character_limit ?? ""}
            onChange={(e) =>
              setForm({ ...form, character_limit: e.target.value })
            }
            className={`border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none ${
              form.is_unlimited ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={form.is_unlimited}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
          />

          {/* Checkboxes */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_unlimited}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_unlimited: e.target.checked,
                    character_limit: e.target.checked ? null : "",
                  })
                }
                className="accent-emerald-600 w-4 h-4"
              />
              <span>Unlimited Character Limit</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
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
