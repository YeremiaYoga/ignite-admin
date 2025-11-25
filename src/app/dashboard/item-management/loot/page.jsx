"use client";

import { useState } from "react";
import LootTable from "./components/LootTable";
import LootImportModal from "./components/LootImportModal";

export default function LootManagementPage() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Loot Management
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            Import JSON
          </button>
        </div>
      </div>

      <LootTable />

      {showImport && <LootImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
