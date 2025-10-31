"use client";

import { useEffect, useState } from "react";
import BackgroundForm from "./BackgroundForm";
import BackgroundViewModal from "./BackgroundViewModal";
import BackgroundTable from "./BackgroundTable";

export default function BackgroundBuilderPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentItem, setCurrentItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // === FETCH ALL BACKGROUNDS ===
  const fetchBackgrounds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/backgrounds`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBackgrounds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch backgrounds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  // === DELETE HANDLER ===
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this background?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/backgrounds/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete background");
      fetchBackgrounds();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // === MODE HANDLER ===
  const handleMode = (mode, item = null) => {
    setFormMode(mode);
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    fetchBackgrounds();
    setShowForm(false);
    setCurrentItem(null);
  };

  return (
    <div className="p-6 text-white">
      {/* === HEADER === */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Background Builder</h1>
        <button
          onClick={() => handleMode("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Create
        </button>
      </div>

      {/* === TABLE === */}
      <BackgroundTable
        data={backgrounds}
        loading={loading}
        onView={(item) => setViewItem(item)}
        onEdit={(item) => handleMode("edit", item)}
        onDelete={handleDelete}
      />

      {/* === VIEW MODAL === */}
      {viewItem && (
        <BackgroundViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}

      {/* === FORM MODAL === */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto relative p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold capitalize">
                {formMode} Background
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setCurrentItem(null);
                }}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <BackgroundForm
              mode={formMode}
              initialData={currentItem}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
