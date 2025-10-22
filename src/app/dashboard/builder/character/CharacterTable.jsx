"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function CharacterTable({
  data = [],
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10 border border-slate-700 rounded-lg">
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10 border border-slate-700 rounded-lg">
        No characters found.
      </div>
    );
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden shadow">
      <table className="w-full border-collapse text-sm text-gray-300">
        <thead className="bg-slate-800 text-gray-200 text-left">
          <tr>
            <th className="py-3 px-4 text-center w-[70px]">Token</th>
            <th className="py-3 px-4 text-center w-[100px]">Art</th>
            <th className="py-3 px-4">Name</th>

            <th className="py-3 px-4">Character Type</th>
            <th className="py-3 px-4">Creator</th>
            <th className="py-3 px-4 text-center w-[110px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ch) => (
            <tr
              key={ch.id}
              className="border-t border-slate-700 hover:bg-slate-800/50 transition"
            >
              <td className="py-2 px-3 text-center">
                {ch.token_image ? (
                  <img
                    src={ch.token_image}
                    alt="token"
                    className="w-10 h-10 object-cover rounded-full border border-slate-600 mx-auto"
                  />
                ) : (
                  <div className="text-gray-500 text-xs italic">No Img</div>
                )}
              </td>
              <td className="py-2 px-3 text-center">
                {ch.art_image ? (
                  <img
                    src={ch.art_image}
                    alt="art"
                    className="w-14 h-14 object-cover rounded-md border border-slate-600 mx-auto"
                  />
                ) : (
                  <div className="text-gray-500 text-xs italic">No Art</div>
                )}
              </td>

              <td className="py-3 px-4 font-medium text-white">
                {ch.name || "-"}
              </td>

              <td className="py-3 px-4 text-gray-300 capitalize">
                {ch.role || ch.character_type || "-"}
              </td>
              <td className="py-3 px-4 text-gray-300">
                {ch.owner_name || ch.creator_name || "-"}
              </td>

              <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onView(ch)}
                    className="text-teal-400 hover:text-teal-300"
                    title="View Character"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(ch)}
                    className="text-yellow-400 hover:text-yellow-300"
                    title="Edit Character"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(ch)}
                    className="text-red-500 hover:text-red-400"
                    title="Delete Character"
                  >
                    <Trash2 size={18} />
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
