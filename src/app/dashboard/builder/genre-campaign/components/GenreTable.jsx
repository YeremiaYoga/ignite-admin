"use client";

import { Pencil, Trash2 } from "lucide-react";

export default function GenreTable({ data = [], loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto border border-gray-800 rounded-xl shadow-lg backdrop-blur bg-slate-900/50">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="py-3 px-4 text-left w-[40px]">#</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Public</th>
            <th className="py-3 px-4 text-left">Creator</th>
            <th className="py-3 px-4 text-left">Created</th>
            <th className="py-3 px-4 text-center w-[120px]">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-400">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-400">
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

                <td className="py-3 px-4 font-medium text-slate-100 truncate max-w-[200px]">
                  {item.name}
                </td>

                <td className="py-3 px-4 text-slate-300 truncate max-w-[260px]">
                  {item.description || "-"}
                </td>

                <td className="py-3 px-4 text-slate-300">
                  {item.public_creation ? "Yes" : "No"}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {item.creator_name}
                </td>

                <td className="py-3 px-4 text-slate-300">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "-"}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                        onClick={() => onEdit(item)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => onDelete(item)}
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
