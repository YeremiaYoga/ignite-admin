"use client";
import { useEffect, useState } from "react";
import IncumbencyForm from "./IncumbencyForm";
import IncumbencyTable from "./IncumbencyTable";
import IncumbencyViewModal from "./IncumbencyViewModal";

export default function IncumbencyBuilderPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentItem, setCurrentItem] = useState(null);
  const [viewItem, setViewItem] = useState(null); // <== NEW for View Modal

  // === LOAD DATA ===
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/incumbency`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDataList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === DELETE HANDLER ===
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this data?")) return;
    try {
      await fetch(`${API_BASE}/api/incumbency/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // === MODE HANDLER (create/edit/duplicate) ===
  const handleMode = (mode, item = null) => {
    setFormMode(mode);
    setCurrentItem(item);
    setShowForm(true);
  };

  return (
    <div className="p-6 text-white">
      {/* === HEADER === */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Incumbencys</h1>
        <button
          onClick={() => handleMode("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Create
        </button>
      </div>

      {/* === TABLE === */}
      <IncumbencyTable
        data={dataList}
        loading={loading}
        onMode={handleMode}
        onDelete={handleDelete}
        onView={(item) => setViewItem(item)} // 👁️ Trigger view modal
      />

      {viewItem && (
        <IncumbencyViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto relative p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold capitalize">
                {formMode} Incumbency
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

            <IncumbencyForm
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
