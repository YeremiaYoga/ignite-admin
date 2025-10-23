"use client";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import AssetPicker from "./AssetPicker";
import { Image as ImageIcon } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_MEDIA_URL;

export default function AssetSelectField({
  label = "Image URL",
  value,
  onChange,
  placeholder = "Select an asset or enter URL",
  initialPath = "",
  hint = "",
}) {
  const [open, setOpen] = useState(false);

  const resolvedSrc =
    value?.startsWith("http") || value?.startsWith("https")
      ? value
      : `${API_BASE}${value?.startsWith("/") ? value : "/" + value}`;

  return (
    <div>
      <div className="flex items-end gap-2">
        <div className="mt-2 h-12 w-12 overflow-hidden rounded-md border border-gray-700 bg-gray-900 flex items-center justify-center">
          {resolvedSrc ? (
            <img
              src={resolvedSrc}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>

        <div className="flex-1">
          <InputField
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            hint={hint}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-[42px] rounded-md border border-slate-700 bg-slate-800 px-3 text-sm hover:bg-slate-700 inline-flex items-center gap-2"
          title="Browse assets"
        >
          <ImageIcon className="w-4 h-4" />
          Browse
        </button>
      </div>

      <AssetPicker
        isOpen={open}
        initialPath={initialPath}
        onClose={() => setOpen(false)}
        onSelect={(selectedUrl) => {
          onChange(selectedUrl);
          setOpen(false);
        }}
      />
    </div>
  );
}
