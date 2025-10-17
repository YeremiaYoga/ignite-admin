"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function MultipleInput({
  labels = "Items",
  label = "Item",
  btnLabel = "Add",
  items = [],
  onChange,
  type = "string", // "string" | "object"
  fields = ["name"], // hanya untuk type object
  selectOptions = null, // hanya untuk single field select
  columns = 1, // jumlah kolom untuk object fields
}) {
  const [entries, setEntries] = useState(
    items.length
      ? items
      : type === "object"
      ? [Object.fromEntries(fields.map((f) => [f, ""]))] // buat objek kosong sesuai fields
      : [""]
  );

  const addItem = () => {
    const newItem =
      type === "object" ? Object.fromEntries(fields.map((f) => [f, ""])) : "";
    const updated = [...entries, newItem];
    setEntries(updated);
    onChange(updated);
  };

  const updateItem = (index, fieldOrValue, valueIfObject) => {
    const updated = [...entries];
    if (type === "object") {
      updated[index] = { ...updated[index], [fieldOrValue]: valueIfObject };
    } else {
      updated[index] = fieldOrValue;
    }
    setEntries(updated);
    onChange(updated);
  };

  const removeItem = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
    onChange(updated);
  };

  return (
    <div className="my-2">
      {labels && (
        <label className="block text-sm font-medium mb-2">{labels}</label>
      )}

      {entries.map((item, index) => (
        <div
          key={index}
          className={`flex items-center mb-2  ${
            type === "object" ? "rounded-lg border  border-gray-600" : ""
          }`}
        >
          {type === "object" ? (
            <div
              className={`flex-1 grid gap-2 p-2 ${
                columns === 2 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {fields.map((f) => (
                <input
                  key={f}
                  type="text"
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={item[f] || ""}
                  onChange={(e) => updateItem(index, f, e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />
              ))}
            </div>
          ) : selectOptions ? (
            <select
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 p-2 rounded-lg border bg-gray-800 border-gray-600"
            >
              <option value="">Select {label}</option>
              {selectOptions.map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder={label}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 p-2 rounded-lg border bg-gray-800 border-gray-600"
            />
          )}

          <div className="flex justify-center items-center px-1">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
      >
        {btnLabel == "Add" || !btnLabel ? `Add ${label}` : btnLabel}
      </button>
    </div>
  );
}
