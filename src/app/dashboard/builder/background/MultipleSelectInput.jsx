"use client";

export default function MultipleSelectInput({
  label,
  field,
  options,
  values,
  onAdd,
  onRemove,
}) {
  return (
    <div>
      <label className="block mb-1 font-bold">{label}:</label>
      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((val) => {
          const opt = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm"
            >
              {opt?.label || val}
              <button
                type="button"
                className="ml-1 text-xs font-bold"
                onClick={() => onRemove(field, val)}
              >
                ✕
              </button>
            </span>
          );
        })}
      </div>
      {/* Select */}
      <select
        className="w-full p-2 rounded bg-gray-700"
        onChange={(e) => {
          onAdd(field, e.target.value);
          e.target.value = "";
        }}
      >
        <option value="">-- Select {label} --</option>
        {options
          .filter((opt) => !values.includes(opt.value))
          .map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    </div>
  );
}
