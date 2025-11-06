"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TraitFormModal from "./components/TraitFormModal";
import TraitTable from "./components/TraitTable";
import ConfirmModal from "@/components/ConfirmModal";

export default function SpeciesTraitsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [species, setSpecies] = useState(null);
  const [traits, setTraits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      // ambil data species berdasarkan slug
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/species/slug/${slug}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!res.ok) throw new Error("Failed to fetch species");
      const data = await res.json();
      setSpecies(data);

      // ambil trait_id dari species.traits
      const traitIds = data.traits?.map((t) => t.trait_id) || [];

      if (traitIds.length === 0) {
        setTraits([]);
        return;
      }

      // fetch hanya trait yang cocok
      const traitRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/admin/trait/by-ids?ids=${traitIds.join(",")}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!traitRes.ok) throw new Error("Failed to fetch trait details");

      const traitData = await traitRes.json();
      setTraits(traitData);
    } catch (err) {
      console.error("💥 fetchSpecies error:", err);
      alert("❌ Failed to load species traits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchSpecies();
  }, [slug]);

  /** ✳️ Add / Edit */
  const handleAdd = () => {
    setSelectedTrait(null);
    setShowModal(true);
  };

  const handleEdit = (trait) => {
    setSelectedTrait(trait);
    setShowModal(true);
  };

  /** 🗑️ Delete confirmation */
  const handleDeleteRequest = (trait) => {
    setConfirmData({
      title: "Delete Trait",
      message: `Are you sure you want to delete "${trait.name}"? This will remove it from the species.`,
      onConfirm: () => handleDelete(trait),
    });
  };

  const handleDelete = async (trait) => {
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/trait/${
          trait.trait_id || trait.id
        }`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error("Failed to delete trait");
      setConfirmData(null);
      fetchSpecies();
    } catch (err) {
      console.error("💥 delete error:", err);
      alert("❌ Failed to delete trait");
    }
  };

  return (
    <div className="p-6 text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {species?.name || slug} — Traits
          </h1>
          <p className="text-sm text-gray-400">
            Manage traits linked to this species
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard/builder/species")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
          >
            + Add Trait
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading traits...</p>
      ) : (
        <TraitTable
          traits={traits}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      {showModal && (
        <TraitFormModal
          data={selectedTrait}
          species={species}
          onClose={() => {
            setShowModal(false);
            fetchSpecies();
          }}
        />
      )}

      {confirmData && (
        <ConfirmModal
          title={confirmData.title}
          message={confirmData.message}
          onConfirm={confirmData.onConfirm}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
