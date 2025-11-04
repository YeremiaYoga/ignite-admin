"use client";
import { useState } from "react";

export default function ConfirmModal({
  title = "Confirmation",
  message = "Are you sure you want to continue?",
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  loadingText = "Processing...",
  icon: Icon = null,
}) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm?.();
      onClose?.();
    } catch (err) {
      console.error("❌ ConfirmModal error:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🎨 Warna tombol utama
  const colorClass =
    confirmColor === "red"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-300"
      : confirmColor === "green"
      ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300"
      : confirmColor === "blue"
      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
      : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-300";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-xl w-[380px] shadow-2xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
        {/* 🔹 Header */}
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>

        {/* 📝 Pesan */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* ⚙️ Tombol Aksi */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-md focus:ring-2 focus:outline-none transition ${colorClass} ${
              loading ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {loading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
