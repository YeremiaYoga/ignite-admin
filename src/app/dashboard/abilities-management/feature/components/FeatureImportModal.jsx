"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, UploadCloud, FileJson2, Trash2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "";

function uniqByFileSignature(files) {
  const map = new Map();
  for (const f of files) {
    const key = `${f.name}__${f.size}__${f.lastModified}`;
    if (!map.has(key)) map.set(key, f);
  }
  return Array.from(map.values());
}

function formatBytes(bytes) {
  const n = Number(bytes || 0);
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let idx = 0;
  let v = n;
  while (v >= 1024 && idx < units.length - 1) {
    v /= 1024;
    idx += 1;
  }
  return `${v.toFixed(idx === 0 ? 0 : 2)} ${units[idx]}`;
}

export default function FeatureImportModal({ onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef(null);
  const dragDepth = useRef(0);

  const totalSize = useMemo(
    () => files.reduce((acc, f) => acc + (f.size || 0), 0),
    [files]
  );

  const fileSummary = useMemo(() => {
    if (!files.length) return "";
    if (files.length === 1) {
      return `${files[0].name} • ${formatBytes(files[0].size)}`;
    }
    return `${files.length} files selected • ${formatBytes(totalSize)}`;
  }, [files, totalSize]);

  const pickValidJsonFiles = (fileList) => {
    if (!fileList || !fileList.length) return [];
    const arr = Array.from(fileList);
    return arr.filter((f) => f.name.toLowerCase().endsWith(".json"));
  };

  const addFiles = (fileList) => {
    const valid = pickValidJsonFiles(fileList);
    if (!valid.length) return;

    setFiles((prev) => uniqByFileSignature([...prev, ...valid]));
    setResult(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFileAt = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleImport = async () => {
    if (!files.length || !API) {
      setResult({ error: !API ? "NEXT_PUBLIC_API_URL belum di-set" : "No files" });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch(`${API}/foundry/features/import-files`, {
        method: "POST",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      let payload = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      if (!res.ok) {
        const msg =
          payload?.error ||
          payload?.message ||
          `Import failed (HTTP ${res.status})`;
        setResult({ error: msg, raw: payload });
        return;
      }

      setResult(payload || { imported: 0 });
    } catch (err) {
      console.error("❌ Import failed:", err);
      setResult({ error: err?.message || "Import failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  // esc to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        <h2 className="text-lg font-semibold mb-2 text-white">
          Import Foundry Feature JSON
        </h2>

        <div
          className={`border-2 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
            isDragging
              ? "border-blue-400 bg-slate-800/60"
              : "border-dashed border-slate-600 bg-slate-900/60 hover:border-blue-500 hover:bg-slate-800/80"
          }`}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="w-8 h-8 text-slate-200 mb-1" />
          <p className="text-sm text-slate-100 font-medium">
            {files.length ? "Add more JSON files" : "Click to select JSON files"}
          </p>
          <p className="text-xs text-slate-400">
            {files.length
              ? "You can select again to add more files (not replacing)."
              : "Or drag & drop one or many .json files here"}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {files.length > 0 && (
            <div className="mt-3 w-full">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <FileJson2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">{fileSummary}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-800/80 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700/70"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <div className="mt-2 max-h-32 overflow-auto rounded-lg border border-slate-700 bg-slate-950/30">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}__${f.size}__${f.lastModified}`}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-slate-200 border-b border-slate-800 last:border-b-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="min-w-0">
                      <p className="truncate">{f.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {formatBytes(f.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-md px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200"
                      onClick={() => removeFileAt(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
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
              <>
                <p className="text-red-300">❌ {result.error}</p>
                {result.raw ? (
                  <p className="text-slate-300 break-words">
                    {typeof result.raw === "string"
                      ? result.raw
                      : JSON.stringify(result.raw)}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-emerald-300">
                  ✅ Imported {result.imported ?? result.items?.length ?? 0} items.
                </p>
                {typeof result.totalFiles === "number" && (
                  <p className="text-slate-300">
                    📁 Files processed: {result.totalFiles} (parsed items:{" "}
                    {result.totalParsedItems ?? "?"})
                  </p>
                )}
                {Array.isArray(result.errors) && result.errors.length > 0 && (
                  <p className="text-amber-300">
                    ⚠ {result.errors.length} item/file gagal diimport (cek detail di response / console).
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
