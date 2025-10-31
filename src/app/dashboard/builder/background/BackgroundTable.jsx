"use client";

import { Eye, Pencil, Trash2, Copy } from "lucide-react";

export default function BackgroundTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  return (
    <div className="overflow-x-auto border border-gray-800 rounded-xl shadow-lg backdrop-blur bg-slate-900/50">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="py-3 px-4 text-left w-[40px]">#</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Source</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Ability Scores</th>
            <th className="py-3 px-4 text-left">Tags</th>
            <th className="py-3 px-4 text-center w-[120px]">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="py-6 text-center text-gray-400">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-6 text-center text-gray-400">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-700 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4">{index + 1}</td>

                <td className="py-3 px-4 font-medium text-slate-100 truncate max-w-[150px]">
                  {item.name}
                </td>

                <td className="py-3 px-4 text-slate-300">
                  {item.source || "-"}
                </td>

                <td className="py-3 px-4 text-slate-400 truncate max-w-[200px]">
                  {item.description || "-"}
                </td>

                <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">
                  {Array.isArray(item.ability_scores)
                    ? item.ability_scores.join(", ")
                    : item.ability_scores || "-"}
                </td>

                <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">
                  {Array.isArray(item.tags)
                    ? item.tags.join(", ")
                    : item.tags || "-"}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onView(item)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
