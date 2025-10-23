// components/AssetPicker.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Folder, ChevronRight, Home, X } from "lucide-react";

export default function AssetPicker({
  isOpen,
  initialPath = "",
  onClose,
  onSelect,
}) {
  const [loading, setLoading] = useState(false);
  const [cwd, setCwd] = useState(initialPath);
  const [data, setData] = useState({
    path: "",
    folders: [],
    files: [],
    breadcrumbs: [],
  });

  const load = async (p) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEDIA_URL}/assets/list?path=${encodeURIComponent(p)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setData(json);
      setCwd(json.path || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load(cwd || initialPath || "");
   
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div
        className="
          absolute left-1/2 top-1/2 w-[min(900px,92vw)]
          -translate-x-1/2 -translate-y-1/2
          rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl
          max-h-[85vh] flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Home className="w-4 h-4" />
            <button className="hover:underline" onClick={() => load("")}>
              assets
            </button>
            {data.breadcrumbs?.slice(1).map((bc) => (
              <React.Fragment key={bc.path}>
                <ChevronRight className="w-4 h-4 opacity-50" />
                <button
                  className="hover:underline"
                  onClick={() => load(bc.path)}
                >
                  {bc.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading...</div>
          ) : (
            <>
              {/* Folder list */}
              {data.folders?.length > 0 && (
                <>
                  <h4 className="mb-2 text-xs uppercase tracking-wider text-slate-400">
                    Folders
                  </h4>
                  <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {data.folders.map((f) => (
                      <button
                        key={f.path}
                        onClick={() => load(f.path)}
                        className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/50 p-2 text-left hover:bg-slate-800"
                      >
                        <Folder className="w-4 h-4 text-amber-300" />
                        <span className="truncate text-sm">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* File list */}
              <h4 className="mb-2 text-xs uppercase tracking-wider text-slate-400">
                Images
              </h4>
              {data.files?.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">
                  No images here.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {data.files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => {
             
                        onSelect(file.url);
                        onClose();
                      }}
                      title={file.path}
                      className="group overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-600"
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-24 w-full object-cover"
                      />
                      <div className="truncate px-2 py-1 text-[11px] text-slate-300 group-hover:text-white">
                        {file.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
