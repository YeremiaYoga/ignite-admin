"use client";

import { useMemo, useState } from "react";
import AddOnTable from "./components/AddOnTable";
import AddOnFormModal from "./components/AddOnFormModal";

export default function SpellsAddOnPage() {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");

  const FIELDS = useMemo(
    () => [
      { key: "classes", label: "Classes", api: "classes", method: "PUT" },
      { key: "damage_type", label: "Damage Type", api: "damage-type", method: "PUT" },

      { key: "subclasses", label: "Subclasses", api: "subclasses", method: "PUT" },
      { key: "species", label: "Species", api: "species", method: "PUT" },
      { key: "subspecies", label: "Subspecies", api: "subspecies", method: "PUT" },

      { key: "homebrew_id", label: "Homebrew", api: "homebrew-source", method: "PATCH" },
    ],
    []
  );

  const handleOpenModal = (spell, fieldObj) => {
    const field =
      typeof fieldObj === "string"
        ? FIELDS.find((f) => f.key === fieldObj)
        : fieldObj;

    setSelectedSpell(spell);
    setSelectedField(field || null);
  };

  const handleClose = () => {
    setSelectedSpell(null);
    setSelectedField(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-5">Spell Add-On Management</h1>

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

      <AddOnTable
        onOpenModal={handleOpenModal}
        refresh={refresh}
        search={search}
        fields={FIELDS} 
      />

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
