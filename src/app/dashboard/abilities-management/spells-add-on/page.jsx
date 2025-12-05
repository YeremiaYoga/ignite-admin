"use client";

import { useState } from "react";
import AddOnTable from "./components/AddOnTable";
import AddOnFormModal from "./components/AddOnFormModal";

const FIELDS = [
  { key: "classes", label: "Classes", api: "classes" },
  { key: "damage_type", label: "Damage Type", api: "damage-type" },
  { key: "subclasses", label: "Subclasses", api: "subclasses" },
  { key: "species", label: "Species", api: "species" },
  { key: "subspecies", label: "Subspecies", api: "subspecies" },
];

export default function SpellsAddOnPage() {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");

  const handleOpenModal = (spell, key) => {
    const field = FIELDS.find((f) => f.key === key);
    setSelectedSpell(spell);
    setSelectedField(field);
  };

  const handleClose = () => {
    setSelectedSpell(null);
    setSelectedField(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-5">Spell Add-On Management</h1>

      {/* 🔍 Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search spell name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 rounded-lg border border-slate-600 
                     bg-slate-900/50 text-sm text-gray-200 outline-none focus:ring-2 
                     focus:ring-blue-500"
        />
      </div>

      {/* Tabel + search + refresh */}
      <AddOnTable onOpenModal={handleOpenModal} refresh={refresh} search={search} />

      {selectedSpell && selectedField && (
        <AddOnFormModal
          spell={selectedSpell}
          field={selectedField}
          onClose={handleClose}
          onSaved={() => {
            setRefresh((x) => x + 1);
            handleClose();
          }}
        />
      )}
    </div>
  );
}
