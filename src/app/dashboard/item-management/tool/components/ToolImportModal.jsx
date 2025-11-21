"use client";

import { useState } from "react";
import { X, UploadCloud, FileJson2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ToolImportModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const getAuthHeader = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setResult(null);

      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch(`${API}/foundry/tools/import`, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include", // kirim cookie ignite_access_token
      });

      const resultJSON = await res.json();
      setResult(resultJSON);
    } catch (err) {
      console.error("❌ Import failed:", err);
      setResult({ error: "Import failed. Please check your JSON file." });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const f = e.dataTransfer.files?.[0];
    if (f && f.name.toLowerCase().endsWith(".json")) {
      handleFileSelect(f);
    }
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

  const fileSizeLabel =
    file && file.size ? `${(file.size / 1024).toFixed(1)} KB` : "";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg relative shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-2 text-white">
          Import Foundry Tool JSON
        </h2>
        <p className="text-xs text-slate-300 mb-4">
          Upload a <span className="font-mono">.json</span> file exported from Foundry VTT.
        </p>

        {/* Upload Box */}
        <div
          className={`border-2 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
            isDragging
              ? "border-blue-400 bg-slate-800/60"
              : "border-dashed border-slate-600 bg-slate-900/60 hover:border-blue-500 hover:bg-slate-800/80"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("tool-json-input")?.click()}
        >
          <UploadCloud className="w-8 h-8 text-slate-200 mb-1" />
          <p className="text-sm text-slate-100 font-medium">
            {file ? "Choose another JSON file" : "Click to select a JSON file"}
          </p>
          <p className="text-xs text-slate-400">or drag & drop here</p>

          <input
            id="tool-json-input"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />

          {file && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-2 text-xs text-slate-200 w-full max-w-xs">
              <FileJson2 className="w-4 h-4 text-emerald-400" />
              <div className="min-w-0">
                <p className="truncate">{file.name}</p>
                {fileSizeLabel && (
                  <p className="text-[11px] text-slate-400">{fileSizeLabel}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={loading || !file}
          className="w-full mt-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium"
        >
          {loading ? "Importing..." : "Import"}
        </button>

        {/* Result Box */}
        {result && (
          <div className="mt-4 text-xs rounded-lg px-3 py-2 bg-slate-800 border border-slate-700">
            {result.error ? (
              <p className="text-red-300">❌ {result.error}</p>
            ) : (
              <p className="text-emerald-300">
                ✅ Imported {result.imported ?? result.items?.length ?? 0} items.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
