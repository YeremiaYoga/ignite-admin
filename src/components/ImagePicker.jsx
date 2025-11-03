"use client";
import React, { useEffect, useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";

/**
 * 🖼️ Dynamic Image Picker
 * - Bisa dipakai untuk /profile/list, /backgrounds/list, /gallery/list, dll.
 *
 * Props:
 *  - isOpen: boolean
 *  - baseUrl: string → contoh `${process.env.NEXT_PUBLIC_API_URL}/profile/list`
 *  - title: string → contoh "Select Profile Picture"
 *  - onSelect(url: string, file: object)
 *  - onClose()
 */
export default function ImagePicker({
  isOpen,
  baseUrl,
  title = "Select Image",
  onSelect,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [path, setPath] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const fetchImages = async (p = "") => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}?path=${encodeURIComponent(p)}`, {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();

      setImages(json.files || []);
      setBreadcrumbs(json.breadcrumbs || []);
      setPath(json.path || "");
    } catch (err) {
      console.error("❌ ImagePicker fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchImages("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="
          absolute left-1/2 top-1/2 w-[min(700px,92vw)]
          -translate-x-1/2 -translate-y-1/2
          rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl
          max-h-[85vh] flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No images found.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img.path}
                  onClick={() => {
                    onSelect(img.url, img);
                    onClose();
                  }}
                  className="relative group overflow-hidden rounded-lg border border-slate-700 hover:border-slate-500"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                  />
             
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
