"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Eye, EyeOff } from "lucide-react";
import InputField from "@/components/InputField";
import AssetSelectField from "@/components/AssetSelectField";
import RichTextEditor from "@/components/RichTextEditor";
const COST_OPTIONS = [
  "Action",
  "Bonus Action",
  "Reaction",
  "Passive",
  "Special",
];

export default function AbilityEditor({
  idx,
  data,
  open,
  onToggle,
  onChange,
  onRemove,
  usedTypes,
  allowedTypes,
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    const next = Array.from(new Set([...(data.type_ability || []), val]));
    onChange("type_ability", next);
    setTagInput("");
  };

  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (t) => {
    onChange(
      "type_ability",
      (data.type_ability || []).filter((x) => x !== t)
    );
  };

  const typeOptions = allowedTypes.map((t) => ({
    value: t,
    label: t,
    disabled: usedTypes.has(t) && data.type !== t,
  }));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="flex items-center gap-3 p-3 justify-between">
        <InputField
          label=""
          value={data.name}
          onChange={(v) => onChange("name", v)}
          placeholder={`Name Ability ${idx + 1}`}
        />
        <div className="md:col-span-2">
          <InputField
            label="Visibility"
            type="toggleIcon"
            value={!!data.visibility}
            onChange={(v) => onChange("visibility", v)}
          />
        </div>
        <div className="flex gap-5">
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md border border-rose-700/50 bg-rose-600/20 p-2 text-rose-200 hover:bg-rose-600/30"
            title="Remove"
          >
            <Trash2 size={16} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-md border border-slate-700 bg-slate-800/80 p-2 hover:bg-slate-700"
            aria-expanded={open}
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-4 border-t border-slate-800 p-3 md:grid-cols-2">
            <InputField
              label="Type"
              type="select"
              value={data.type}
              onChange={(v) => onChange("type", v)}
              options={typeOptions}
            />

            <InputField
              label="Cost"
              type="select"
              value={data.cost}
              onChange={(v) => onChange("cost", v)}
              options={COST_OPTIONS}
            />

            <div className="md:col-span-2">
              <InputField
                label="Additional Cost"
                value={data.additional_cost}
                onChange={(v) => onChange("additional_cost", v)}
                placeholder="cost"
              />
            </div>

            <div className="md:col-span-2">
              <AssetSelectField
                label="Image URL"
                value={data.img}
                onChange={(v) => onChange("img", v)}
                initialPath=""
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Type Ability (tags)
              </label>
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-600 bg-gray-800/50 p-2">
                {(data.type_ability || []).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-600/20 px-2 py-1 text-xs text-indigo-200"
                  >
                    {t}
                    <button
                      onClick={() => removeTag(t)}
                      className="ml-1 rounded p-0.5 hover:bg-indigo-600/30"
                      title="Remove tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKeyDown}
                  placeholder="type and press Add"
                  className="flex-1 bg-transparent px-2 py-1 text-sm text-slate-200 outline-none"
                />
                <button
                  onClick={addTag}
                  className="rounded-md border border-indigo-700 bg-indigo-600/20 px-2 py-1 text-xs text-indigo-200 hover:bg-indigo-600/30"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <RichTextEditor
                value={data.description}
                onChange={(v) => onChange("description", v)}
                placeholder="description"
                rows={10}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
