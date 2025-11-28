"use client";

import { useState } from "react";
import { X, UploadCloud, FileJson2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ContainerImportModal({ onClose }) {
  const [files, setFiles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImport = async () => {
    if (!files.length) return;

    try {
      setLoading(true);
      setResult(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch(`${API}/foundry/containers/import-files`, {
        method: "POST",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        
        },
      });

      const resultJSON = await res.json();
      setResult(resultJSON);
    } catch (err) {
      console.error("❌ Import failed:", err);
      setResult({ error: "Import failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileList) => {
    if (!fileList || !fileList.length) return;

    const validFiles = Array.from(fileList).filter((f) =>
      f.name.toLowerCase().endsWith(".json")
    );

    if (!validFiles.length) return;

    setFiles(validFiles); 
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const fileList = e.dataTransfer.files;
    handleFileSelect(fileList);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const fileSummary = (() => {
    if (!files.length) return "";
    if (files.length === 1) {
      const sizeKB = files[0].size ? (files[0].size / 1024).toFixed(1) : "";
      return `${files[0].name}${sizeKB ? ` • ${sizeKB} KB` : ""}`;
    }
    const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    return `${files.length} files selected • ~${sizeMB} MB`;
  })();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        <h2 className="text-lg font-semibold mb-2 text-white">
          Import Foundry Container JSON
        </h2>

        <div
          className={`border-2 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
            isDragging
              ? "border-blue-400 bg-slate-800/60"
              : "border-dashed border-slate-600 bg-slate-900/60 hover:border-blue-500 hover:bg-slate-800/80"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("container-json-input")?.click()}
        >
          <UploadCloud className="w-8 h-8 text-slate-200 mb-1" />
          <p className="text-sm text-slate-100 font-medium">
            {files.length
              ? "Choose other JSON files"
              : "Click to select JSON files"}
          </p>
          <p className="text-xs text-slate-400">
            {files.length
              ? "You can re-select to replace the current selection."
              : "Or drag & drop one or many .json files here"}
          </p>

          <input
            id="container-json-input"
            type="file"
            accept=".json"
            multiple 
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {files.length > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-2 text-xs text-slate-200 w-full max-w-xs">
              <FileJson2 className="w-4 h-4 text-emerald-400" />
              <div className="min-w-0">
                <p className="truncate">
                  {files.length === 1 ? files[0].name : `${files.length} files`}
                </p>
                {fileSummary && (
                  <p className="text-[11px] text-slate-400">{fileSummary}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleImport}
          disabled={loading || !files.length}
          className="w-full mt-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium"
        >
          {loading
            ? "Importing..."
            : `Import${files.length > 1 ? ` ${files.length} files` : ""}`}
        </button>

        {result && (
          <div className="mt-4 text-xs rounded-lg px-3 py-2 bg-slate-800 border border-slate-700 space-y-1">
            {result.error ? (
              <p className="text-red-300">❌ {result.error}</p>
            ) : (
              <>
                <p className="text-emerald-300">
                  ✅ Imported {result.imported ?? result.items?.length ?? 0}{" "}
                  items.
                </p>
                {typeof result.totalFiles === "number" && (
                  <p className="text-slate-300">
                    📁 Files processed: {result.totalFiles} (parsed items:{" "}
                    {result.totalParsedItems ?? "?"})
                  </p>
                )}
                {Array.isArray(result.errors) && result.errors.length > 0 && (
                  <p className="text-amber-300">
                    ⚠ {result.errors.length} item/file gagal diimport (cek
                    detail di response / console).
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
