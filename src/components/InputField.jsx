import { useState, useEffect, useRef } from "react";
import { Info, Eye, EyeOff } from "lucide-react";

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows = 4,
  options = [],
  disabled = false,
  hint = "",
  toggleLabel,
  iconSize = 16,
}) {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const filteredOptions =
    type === "selectSearch"
      ? options.filter((opt) =>
          (opt.label ?? opt)
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : options;

  const handleSelect = (opt) => {
    onChange(opt.value ?? opt);
    setQuery(opt.label ?? opt);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          {label}
          {hint && (
            <div className="relative group">
              <Info size={14} className="text-gray-400 cursor-pointer" />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-gray-200 text-xs rounded-md px-2 py-1 shadow-lg z-20 whitespace-nowrap">
                {hint}
              </div>
            </div>
          )}
        </label>
      )}

      {/* === field types === */}
      {type === "selectSearch" ? (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              onChange("");
            }}
            onClick={() => setIsOpen(true)}
            placeholder={placeholder || "Search..."}
            disabled={disabled}
            className={`w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-400">No results found.</div>
              ) : (
                <ul>
                  {filteredOptions.map((opt) => (
                    <li
                      key={opt.value ?? opt}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-700 capitalize"
                      onClick={() => handleSelect(opt)}
                    >
                      {opt.image && (
                        <img
                          src={opt.image}
                          alt={opt.label ?? opt}
                          className="w-5 h-5 rounded object-cover"
                        />
                      )}
                      <span>
                        {opt.label
                          ? opt.label.replace(/_/g, " ")
                          : opt.toString().replace(/_/g, " ")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border text-sm resize-none outline-none
            ${
              disabled
                ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500"
            }`}
        />
      ) : type === "select" ? (
        <select
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border text-sm outline-none
    ${
      disabled
        ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed opacity-60"
        : "bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500"
    }`}
        >
          <option value="">{placeholder || "Please select"}</option>
          {options.map((opt) => (
            <option
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              disabled={opt.disabled}
              className={`capitalize ${
                opt.disabled ? "text-gray-400 font-semibold" : ""
              }`}
            >
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : type === "selectButton" ? (
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.value ?? opt}
              type="button"
              onClick={() => !disabled && onChange(opt.value ?? opt)}
              className={`flex-1 px-3 py-2 rounded-md border text-sm text-center ${
                value === (opt.value ?? opt)
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              {opt.label ?? opt}
            </button>
          ))}
        </div>
      ) : type === "selectImage" ? (
        <div className="relative w-full min-w-[120px]">
          <div
            className="border rounded-md p-2 bg-gray-800 text-white cursor-pointer flex items-center gap-2 w-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {value ? (
              <div className="flex items-center gap-2">
                <img
                  src={options.find((o) => o.value === value)?.image}
                  className="w-6 h-6 object-cover rounded"
                />
                <span className="text-xs">
                  {options.find((o) => o.value === value)?.label}
                </span>
              </div>
            ) : (
              <span className="text-gray-400 text-xs">
                {placeholder || "Select"}
              </span>
            )}
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto w-full">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer ${
                    value === opt.value
                      ? "bg-gray-700 border-l-2 border-blue-500"
                      : ""
                  }`}
                >
                  <img
                    src={opt.image}
                    className="w-6 h-6 object-cover rounded"
                  />
                  <span className="text-xs text-gray-200">{opt.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : type === "toggleIcon" ? (
        <button
          type="button"
          onClick={() => !disabled && onChange(!value)}
          disabled={disabled}
          aria-pressed={!!value}
          title={toggleLabel ?? (value ? "Visible" : "Hidden")}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition
      ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      ${
        value
          ? "border-emerald-700 bg-emerald-600/20 text-emerald-200"
          : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
        >
          {value ? <Eye size={iconSize} /> : <EyeOff size={iconSize} />}

          <span>{toggleLabel ?? (value ? "Visible" : "Hidden")}</span>
        </button>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border text-sm outline-none
            ${
              disabled
                ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500"
            }`}
        />
      )}
    </div>
  );
}
