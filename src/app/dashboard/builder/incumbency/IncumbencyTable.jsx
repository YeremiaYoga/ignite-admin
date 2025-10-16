"use client";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function IncumbencyTable({ data, loading, onEdit, onDelete }) {
const handleView = (item) => {
  let message = "🧩 INCUMBENCY DETAILS\n\n";

  for (const key in item) {
    const value = item[key];

    if (typeof value === "object" && value !== null) {
      message += `${key}: ${JSON.stringify(value, null, 2)}\n\n`;
    } else {
      message += `${key}: ${value}\n`;
    }
  }

  alert(message);
};


  return (
    <div className="overflow-x-auto border border-gray-800 rounded-xl shadow-lg backdrop-blur bg-slate-900/50">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="py-3 px-4 text-left w-[40px]">#</th>
            <th className="py-3 px-4 text-left w-[80px]">Image</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-center">Version</th>
            <th className="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-400">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-400">
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

                <td className="py-3 px-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 text-xs text-slate-500 rounded-lg">
                      No Image
                    </div>
                  )}
                </td>

                <td className="py-3 px-4 font-medium text-slate-100">
                  {item.name}
                </td>

                <td className="py-3 px-4 capitalize text-slate-300">
                  {item.role || "-"}
                </td>

                <td className="py-3 px-4 text-center text-slate-200">
                  {item.version ?? 1}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleView(item)}
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
                      disabled
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
