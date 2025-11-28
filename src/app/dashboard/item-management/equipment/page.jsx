"use client";

import { useState } from "react";
import EquipmentTable from "./components/EquipmentTable";
import EquipmentImportModal from "./components/EquipmentImportModal";

export default function EquipmentManagementPage() {
  const [showImport, setShowImport] = useState(false);
  const [importMode, setImportMode] = useState(null); // "body" | "files" | null

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
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
             Equipment Management
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
   
         <EquipmentTable />
   
         {showImport && (
           <EquipmentImportModal
             mode={importMode} 
             onClose={handleCloseImport}
           />
         )}
       </div>
  );
}
