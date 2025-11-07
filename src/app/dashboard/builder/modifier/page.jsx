"use client";
import { useEffect, useState } from "react";
import ModifierTable from "./components/ModifierTable";
import TraitModifierFormModal from "./components/TraitModifierFormModal";
import SubtypeModal from "./components/SubtypeModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function ModifierPage() {
  const [modifiers, setModifiers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSubtype, setShowSubtype] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteSubtype, setConfirmDeleteSubtype] = useState(null);
  const [editSubtype, setEditSubtype] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🧩 Fetch all modifiers
  const fetchModifiers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${BASE_URL}/admin/trait-modifier`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Unauthorized or failed to fetch modifiers");
      const data = await res.json();
      setModifiers(data);
    } catch (err) {
      console.error("Fetch modifiers error:", err);
    }
  };

  useEffect(() => {
    fetchModifiers();
  }, []);

  // 🧩 Delete modifier
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${BASE_URL}/admin/trait-modifier/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Unauthorized — please log in again");
        throw new Error("Failed to delete modifier");
      }

      setConfirmDelete(null);
      fetchModifiers();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🧩 Delete subtype
  const handleDeleteSubtype = async (modifier, subtype) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(
        `${BASE_URL}/admin/trait-modifier/${modifier.id}/subtype/${subtype.slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Unauthorized — please log in again");
        throw new Error("Failed to delete subtype");
      }

      setConfirmDeleteSubtype(null);
      fetchModifiers();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🧩 Update (rename) subtype
  const handleEditSubtype = (modifier, subtype) => {
    setSelected(modifier);
    setEditSubtype(subtype);
    setShowSubtype(true);
  };

  return (
    <div className="p-6 text-gray-200">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trait Modifiers</h2>
        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm font-medium"
        >
          + Add Modifier
        </button>
      </div>

      {/* TABLE */}
      <ModifierTable
        modifiers={modifiers}
        onEdit={(mod) => {
          setSelected(mod);
          setShowForm(true);
        }}
        onAddSubtype={(mod) => {
          setSelected(mod);
          setEditSubtype(null);
          setShowSubtype(true);
        }}
        onEditSubtype={handleEditSubtype}
        onDeleteSubtype={(mod, s) => setConfirmDeleteSubtype({ mod, s })}
        onDelete={(mod) => setConfirmDelete(mod)}
      />

      {/* CREATE / EDIT MODIFIER */}
      {showForm && (
        <TraitModifierFormModal
          data={selected}
          onClose={() => setShowForm(false)}
          onSaved={fetchModifiers}
        />
      )}

      {/* ADD / EDIT SUBTYPE */}
      {showSubtype && selected && (
        <SubtypeModal
          modifier={selected}
          editData={editSubtype}
          onClose={() => {
            setShowSubtype(false);
            setEditSubtype(null);
          }}
          onSaved={fetchModifiers}
        />
      )}

      {/* CONFIRM DELETE MODIFIER */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Modifier"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}

      {/* CONFIRM DELETE SUBTYPE */}
      {confirmDeleteSubtype && (
        <ConfirmModal
          title="Delete Subtype"
          message={`Delete subtype "${confirmDeleteSubtype.s.name}" from "${confirmDeleteSubtype.mod.name}"?`}
          onConfirm={() =>
            handleDeleteSubtype(
              confirmDeleteSubtype.mod,
              confirmDeleteSubtype.s
            )
          }
          onClose={() => setConfirmDeleteSubtype(null)}
        />
      )}
    </div>
  );
}
