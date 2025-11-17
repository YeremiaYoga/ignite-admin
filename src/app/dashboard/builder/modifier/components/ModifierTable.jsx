"use client";
import { Edit3, Trash2, PlusCircle } from "lucide-react";

const ALLOWED_TARGETS = [
  "item",
  "magic_item",
  "background",
  "spell",
  "monster",
  "feat",
  "species",
  "subclass",
  "class",
  "trait"
];

function formatTargetLabel(v) {
  if (v === "magic_item") return "Magic Item";
  if (v === "subclass") return "Subclass";
  return String(v)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ModifierTable({
  modifiers,
  onEdit,
  onAddSubtype,
  onDelete,
  onEditSubtype,
  onDeleteSubtype,
}) {
  if (!modifiers?.length)
    return (
      <div className="text-center text-gray-500 border border-gray-700 rounded-lg py-6">
        No modifiers found.
      </div>
    );

  const MAX_SUBTYPES = 7;

  return (
    <div className="overflow-x-auto border border-gray-700 rounded-lg">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            <th className="p-3 text-left w-[18%]">Name</th>
            <th className="p-3 text-left w-[18%]">Slug</th>
            <th className="p-3 text-left w-[10%]">Public</th>
            <th className="p-3 text-left w-[22%]">Target For</th>
            <th className="p-3 text-left">Subtypes</th>
            <th className="p-3 text-right w-[200px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {modifiers.map((mod) => {
            const targetsRaw = mod.target_for ?? mod.for ?? [];
            const targets = Array.isArray(targetsRaw) ? targetsRaw : [];
            const safeTargets = targets.filter((t) =>
              ALLOWED_TARGETS.includes(t)
            );

            // Subtypes slice + counter
            const allSubtypes = Array.isArray(mod.subtypes) ? mod.subtypes : [];
            const shownSubtypes = allSubtypes.slice(0, MAX_SUBTYPES);
            const remainingCount =
              allSubtypes.length > MAX_SUBTYPES
                ? allSubtypes.length - MAX_SUBTYPES
                : 0;

            return (
              <tr
                key={mod.id}
                className="border-t border-gray-700 hover:bg-gray-800/70 transition-colors"
              >
                {/* Name */}
                <td className="p-3 font-medium text-white">{mod.name}</td>

                {/* Slug */}
                <td className="p-3 text-gray-400">{mod.slug}</td>

                {/* Public */}
                <td className="p-3">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs border border-gray-600 bg-gray-800/80">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        mod.public ? "bg-emerald-500" : "bg-gray-500"
                      }`}
                    />
                    <span className="text-gray-100">
                      {mod.public ? "Public" : "Private"}
                    </span>
                  </div>
                </td>

                {/* Target For */}
                <td className="p-3 align-top">
                  {safeTargets.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {safeTargets.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-600 text-[11px] text-gray-100"
                        >
                          {formatTargetLabel(t)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs">No target set</span>
                  )}
                </td>

                {/* Subtypes */}
                <td className="p-3 align-top">
                  {shownSubtypes.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {shownSubtypes.map((s) => (
                        <div
                          key={s.slug}
                          className="group relative inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-700/80 hover:bg-gray-700 border border-gray-600 text-xs text-gray-100 cursor-pointer transition"
                        >
                          <span>{s.name}</span>

                          {/* Hover Actions */}
                          <div
                            className="hidden group-hover:flex gap-1 absolute bottom-full left-1/2 -translate-x-1/2 mb-1
             bg-gray-900/95 rounded px-1 py-0.5 shadow-lg z-10"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditSubtype?.(mod, s);
                              }}
                              title="Edit subtype"
                              className="text-yellow-400 hover:text-yellow-300 p-0.5"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSubtype?.(mod, s);
                              }}
                              title="Delete subtype"
                              className="text-red-400 hover:text-red-300 p-0.5"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {remainingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-800/80 border border-dashed border-gray-600 text-[11px] text-gray-300">
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs">No subtypes</span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onAddSubtype(mod)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 px-2 py-1 text-sm transition"
                    >
                      <PlusCircle size={14} /> Add
                    </button>

                    <button
                      onClick={() => onEdit(mod)}
                      className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 px-2 py-1 text-sm transition"
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    <button
                      onClick={() => onDelete(mod)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 px-2 py-1 text-sm transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
