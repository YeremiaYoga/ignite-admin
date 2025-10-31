"use client";
import { Eye, Pencil, Trash2, Copy } from "lucide-react";

export default function FeatTable({ data, loading, onMode, onDelete, onView }) {
  return (
    <div className="overflow-x-auto border border-gray-800 rounded-xl shadow-lg backdrop-blur bg-slate-900/50">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="py-3 px-4 text-left w-[40px]">#</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Source</th>
            <th className="py-3 px-4 text-left">Feat</th>
            <th className="py-3 px-4 text-left">Tags</th>
            <th className="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-400">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-700 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-slate-100">
                  {item.name}
                </td>
                <td className="py-3 px-4 text-slate-300">{item.source}</td>
                <td className="py-3 px-4 text-slate-300">{item.feat}</td>
                <td className="py-3 px-4">
                  {item.tags?.length
                    ? item.tags.map((t, i) => (
                        <span
                          key={i}
                          className="inline-block bg-teal-700/50 text-xs px-2 py-0.5 rounded mr-1"
                        >
                          {t}
                        </span>
                      ))
                    : "-"}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onView(item)}
                      className="text-blue-400 hover:text-blue-300"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onMode("duplicate", item)}
                      className="text-green-400 hover:text-green-300"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => onMode("edit", item)}
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 hover:text-red-400"
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
