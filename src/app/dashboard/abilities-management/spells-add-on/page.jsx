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
  const [refresh, setRefresh] = useState(0);     // <<====== ADD refresh

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

      {/* TABLE + refresh trigger */}
      <AddOnTable onOpenModal={handleOpenModal} refresh={refresh} />

      {selectedSpell && selectedField && (
        <AddOnFormModal
          spell={selectedSpell}
          field={selectedField}
          onClose={handleClose}
          onSaved={() => {
            setRefresh((x) => x + 1); // 🔥 Auto reload tabel
            handleClose();
          }}
        />
      )}
    </div>
  );
}
