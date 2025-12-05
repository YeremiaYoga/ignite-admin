"use client";

import { useState } from "react";
import SpellTable from "./components/SpellTable";
import SpellImportModal from "./components/SpellImportModal";

export default function SpellManagementPage() {
  const [showImport, setShowImport] = useState(false);
  const [importMode, setImportMode] = useState(null); // "body" | "files" | null
  const [search, setSearch] = useState("");

  const handleOpenImport = (mode) => {
    setImportMode(mode);
    setShowImport(true);
  };

  const handleCloseImport = () => {
    setShowImport(false);
    setImportMode(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Spell Management
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenImport("files")}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
          >
            Mass Import JSON
          </button>
          <button
            onClick={() => handleOpenImport("body")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            Import JSON
          </button>
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search spell name, school, or compendium..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/50 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <SpellTable search={search} />

      {showImport && (
        <SpellImportModal mode={importMode} onClose={handleCloseImport} />
      )}
    </div>
  );
}
