"use client";

import { useState } from "react";
import ContainerTable from "./components/ContainerTable";
import ContainerImportModal from "./components/ContainerImportModal";

export default function ContainerManagementPage() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Container Management
        </h1>

        <button
          onClick={() => setShowImport(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
        >
          Import JSON
        </button>
      </div>

      <ContainerTable />

      {showImport && (
        <ContainerImportModal onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}
