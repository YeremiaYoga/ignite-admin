"use client";
import { useState, useEffect } from "react";
import TierTable from "./TierTable";
import TierFormModal from "./TierFormModal";
import TierDetailModal from "./TierDetailModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Trash2 } from "lucide-react";

export default function TierManagementPage() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [modalType, setModalType] = useState(null); // "create" | "edit" | "detail" | "delete"

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔄 Ambil semua tiers
  async function fetchTiers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tiers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const json = await res.json();
      if (json.success) setTiers(json.data);
    } catch (err) {
      console.error("❌ Fetch tiers error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTiers();
  }, []);

  // 📦 Modal handler
  function openModal(type, tier = null) {
    setSelectedTier(tier);
    setModalType(type);
  }

  function closeModal() {
    setSelectedTier(null);
    setModalType(null);
  }

  // 🗑️ Delete tier handler
  async function handleDeleteTier() {
    try {
      const res = await fetch(`${API_URL}/tiers/${selectedTier.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const json = await res.json();
      if (json.success) fetchTiers();
    } catch (err) {
      console.error("❌ Delete tier error:", err);
    }
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tier Management</h2>
        <button
          onClick={() => openModal("create")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
        >
          + Create Tier
        </button>
      </div>

      {/* TABLE */}
      <TierTable
        tiers={tiers}
        loading={loading}
        onEdit={(tier) => openModal("edit", tier)}
        onDetail={(tier) => openModal("detail", tier)}
        onDelete={(tier) => openModal("delete", tier)}
      />

      {/* CREATE / EDIT */}
      {modalType === "create" && (
        <TierFormModal onClose={closeModal} onSaved={fetchTiers} />
      )}
      {modalType === "edit" && (
        <TierFormModal
          onClose={closeModal}
          onSaved={fetchTiers}
          tier={selectedTier}
        />
      )}

      {/* DETAIL */}
      {modalType === "detail" && (
        <TierDetailModal tier={selectedTier} onClose={closeModal} />
      )}

      {/* UNIVERSAL CONFIRM MODAL */}
      {modalType === "delete" && selectedTier && (
        <ConfirmModal
          title="Delete Tier"
          message={`Are you sure you want to delete tier "${selectedTier.name}"?\nThis action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          loadingText="Deleting..."
          icon={Trash2}
          onConfirm={handleDeleteTier}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
