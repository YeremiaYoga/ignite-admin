"use client";
import React, { useState } from "react";
import InputField from "@/components/InputField"; // <- path sesuai punyamu
import AssetPicker from "./AssetPicker";
import { Image as ImageIcon } from "lucide-react";

export default function AssetSelectField({
  label = "Image URL",
  value,
  onChange,
  placeholder = "/assets/...",
  initialPath = "",
  hint = "Browse from /public/assets",
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-end gap-2">
        <div className="mt-2 h-12 w-12 overflow-hidden rounded-md border border-gray-700 bg-gray-900">
          {value ? (
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full text-center text-[10px] leading-[3rem] text-gray-500">
              No Img
            </div>
          )}
        </div>
        <div className="flex-1">
          <InputField
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
           
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
        onSelect={(selectedUrl) => onChange(selectedUrl)}
      />
    </div>
  );
}
