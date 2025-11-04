"use client";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function TierTable({ tiers, loading, onEdit, onDetail, onDelete }) {
  const [tierList, setTierList] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🧩 Sync dari props → state internal
  useEffect(() => {
    if (tiers && tiers.length) setTierList(tiers);
  }, [tiers]);

  // 🔄 Toggle active
  async function toggleActive(tier) {
    try {
      setProcessingId(tier.id);

      // langsung update UI (optimistic)
      setTierList((prev) =>
        prev.map((t) =>
          t.id === tier.id ? { ...t, is_active: !t.is_active } : t
        )
      );

      const res = await fetch(`${API_URL}/tiers/${tier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ is_active: !tier.is_active }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to toggle tier");
    } catch (err) {
      console.error("❌ Toggle active error:", err);
      // rollback jika gagal
      setTierList((prev) =>
        prev.map((t) =>
          t.id === tier.id ? { ...t, is_active: tier.is_active } : t
        )
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading)
    return (
      <div className="text-gray-500 text-sm  rounded-md p-4 shadow-sm border">
        Loading tiers...
      </div>
    );

  if (!tierList.length)
    return (
      <div className="text-gray-400 text-sm italic  rounded-md p-4 shadow-sm border">
        No tiers found.
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-center">Character Limit</th>
            <th className="p-3 text-center">Active</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {tierList.map((tier) => (
            <tr
              key={tier.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                {tier.name}
              </td>
              <td className="p-3 text-gray-600 dark:text-gray-300">{tier.slug}</td>
              <td className="p-3 text-center">
                {tier.is_unlimited ? "Unlimited" : tier.character_limit}
              </td>

              {/* ✅ Flowbite toggle */}
              <td className="p-3 text-center">
                <label
                  className={`inline-flex items-center cursor-pointer ${
                    processingId === tier.id ? "opacity-60 cursor-wait" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tier.is_active}
                    onChange={() => toggleActive(tier)}
                    disabled={processingId === tier.id}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-600"></div>
                </label>
              </td>

              {/* 🧩 Actions */}
              <td className="p-3 text-center flex justify-center gap-2">
                <button
                  onClick={() => onDetail(tier)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(tier)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit Tier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(tier)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
