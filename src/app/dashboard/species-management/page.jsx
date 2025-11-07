"use client";

import { useState, useEffect } from "react";
import SpeciesTable from "./components/SpeciesTable";
import SpeciesForm from "./components/SpeciesForm";
import ConfirmModal from "@/components/ConfirmModal";

export default function SpeciesPage() {
  const [speciesList, setSpeciesList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 🔁 Ambil semua species */
  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/species`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`Failed to fetch species: ${res.status}`);
      const data = await res.json();
      setSpeciesList(data || []);
    } catch (err) {
      console.error("💥 fetchSpecies error:", err);
      alert("❌ Failed to load species list. Please re-login as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  /** ✳️ Create or Edit */
  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelected(item);
    setShowForm(true);
  };

  /** 🗑️ Delete */
  const handleDelete = (item) => {
    setSelected(item);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selected?.id) return alert("❌ Invalid species selected.");

      const token = localStorage.getItem("admin_token");
      if (!token) return alert("⚠️ Missing admin token, please log in again.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/species/${selected.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to delete species.");
      }

      alert("✅ Species deleted successfully");
      fetchSpecies();
    } catch (err) {
      console.error("💥 Delete error:", err);
      alert("❌ Error deleting species. Check console for details.");
    } finally {
      setShowDelete(false);
      setSelected(null);
    }
  };

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Species Management</h1>

      {showForm ? (
        <SpeciesForm
          data={selected}
          onClose={() => {
            setShowForm(false);
            fetchSpecies();
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
            >
              + Add Species
            </button>

            {loading && (
              <span className="text-sm text-gray-400 animate-pulse">
                Loading species...
              </span>
            )}
          </div>

          <SpeciesTable
            species={speciesList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {showDelete && (
        <ConfirmModal
          show={showDelete}
          title="Delete Species"
          message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
