"use client";

import { useEffect, useState } from "react";
import FeatForm from "./FeatForm";
import FeatTable from "./FeatTable";
import FeatViewModal from "./FeatViewModal";

export default function FeatBuilderPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentItem, setCurrentItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // === FETCH DATA ===
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/feats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDataList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to load feats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === DELETE HANDLER ===
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this feat?")) return;
    try {
      await fetch(`${API_BASE}/api/feats/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // === OPEN FORM (create/edit/duplicate) ===
  const handleMode = (mode, item = null) => {
    setFormMode(mode);
    setCurrentItem(item);
    setShowForm(true);
  };

  return (
    <div className="p-6 text-white">
      {/* === HEADER === */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Feats</h1>
        <button
          onClick={() => handleMode("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Create
        </button>
      </div>

      {/* === TABLE === */}
      <FeatTable
        data={dataList}
        loading={loading}
        onMode={handleMode}
        onDelete={handleDelete}
        onView={(item) => setViewItem(item)}
      />

      {viewItem && (
        <FeatViewModal item={viewItem} onClose={() => setViewItem(null)} />
      )}

      {/* === FORM MODAL === */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-[800px] max-h-[90vh] overflow-y-auto relative p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold capitalize">
                {formMode} Feat
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

            <FeatForm
              mode={formMode}
              initialData={currentItem}
              onSaved={() => {
                fetchData();
                setShowForm(false);
                setCurrentItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
