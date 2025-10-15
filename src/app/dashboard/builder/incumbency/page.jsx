"use client";
import { useState } from "react";
import IncumbencyForm from "./IncumbencyForm";

export default function IncumbencyBuilderPage() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      console.log("🧩 Form data to save:", formData);

      alert("✅ Data berhasil disimpan (simulasi)");
      setShowForm(false);
    } catch (err) {
      console.error("❌ Gagal menyimpan:", err);
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Incumbencys</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Create
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto relative p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Incumbency</h2>
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <IncumbencyForm
              onSave={handleSave}
              saving={saving}
              mode="create"
            />
          </div>
        </div>
      )}
    </div>
  );
}
