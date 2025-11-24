"use client";

import { useState } from "react";
import ConsumableTable from "./components/ConsumableTable";
import ConsumableImportModal from "./components/ConsumableImportModal";

export default function ConsumableManagementPage() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Consumable Management
        </h1>

        <button
          onClick={() => setShowImport(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
        >
          Import JSON
        </button>
      </div>

      <ConsumableTable />

      {showImport && (
        <ConsumableImportModal onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}
