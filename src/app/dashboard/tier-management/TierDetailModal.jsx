"use client";

export default function TierDetailModal({ tier, onClose }) {
  if (!tier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          Tier Detail
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-500 dark:text-gray-400">Name</span>
            <span>{tier.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500 dark:text-gray-400">Slug</span>
            <span>{tier.slug}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500 dark:text-gray-400">
              Character Limit
            </span>
            <span>
              {tier.is_unlimited ? "Unlimited" : tier.character_limit || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500 dark:text-gray-400">Status</span>
            <span
              className={`font-semibold ${
                tier.is_active ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {tier.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <span className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              Description
            </span>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-2 rounded-md min-h-[60px]">
              {tier.description || "-"}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
