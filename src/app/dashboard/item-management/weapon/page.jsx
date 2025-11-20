"use client";

import WeaponTable from "./components/WeaponTable";
import WeaponImportModal from "./components/WeaponImportModal";

import { useState } from "react";

export default function WeaponManagementPage() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Weapon Management
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

      <WeaponTable />

      {showImport && <WeaponImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
