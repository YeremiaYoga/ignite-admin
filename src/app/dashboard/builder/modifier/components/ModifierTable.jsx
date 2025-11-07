"use client";
import { Edit3, Trash2, PlusCircle } from "lucide-react";

export default function ModifierTable({
  modifiers,
  onEdit,
  onAddSubtype,
  onDelete,
  onEditSubtype,
  onDeleteSubtype,
}) {
  if (!modifiers.length)
    return (
      <div className="text-center text-gray-500 border border-gray-700 rounded-lg py-6">
        No modifiers found.
      </div>
    );

  return (
    <div className="overflow-x-auto border border-gray-700 rounded-lg">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            <th className="p-3 text-left w-[20%]">Name</th>
            <th className="p-3 text-left w-[20%]">Slug</th>
            <th className="p-3 text-left">Subtypes</th>
            <th className="p-3 text-right w-[180px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {modifiers.map((mod) => (
            <tr
              key={mod.id}
              className="border-t border-gray-700 hover:bg-gray-800/70 transition-colors"
            >
              <td className="p-3 font-medium text-white">{mod.name}</td>
              <td className="p-3 text-gray-400">{mod.slug}</td>

              <td className="p-3 align-top">
                {mod.subtypes?.length ? (
                  <div className="grid grid-cols-4 gap-2">
                    {mod.subtypes.map((s) => (
                      <div
                        key={s.slug}
                        className="group relative flex items-center justify-between bg-gray-700/70 hover:bg-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 cursor-pointer transition"
                      >
                        <span className="truncate max-w-[85px]" title={s.name}>
                          {s.name}
                        </span>

                        {/* Hover Actions */}
                        <div className="hidden group-hover:flex gap-1 absolute right-1 top-1/2 -translate-y-1/2 bg-gray-800/70 rounded px-0.5">
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
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs">No subtypes</span>
                )}
              </td>

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
          ))}
        </tbody>
      </table>
    </div>
  );
}
