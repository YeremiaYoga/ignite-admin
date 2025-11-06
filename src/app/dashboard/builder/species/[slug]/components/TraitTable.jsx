export default function TraitTable({ traits, onEdit, onDelete }) {
  if (!traits?.length)
    return (
      <p className="text-gray-400 italic">
        No traits found for this species.
      </p>
    );

  console.log(traits);

  return (
    <div className="overflow-x-auto border border-gray-700 rounded-lg">
      <table className="w-full text-sm text-gray-200">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Order</th>
            <th className="px-3 py-2 text-left">Scope</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {traits.map((trait) => (
            <tr
              key={trait.trait_id || trait.id}
              className="border-t border-gray-700 hover:bg-gray-800/50 transition"
            >
              {/* 🧩 Name */}
              <td className="px-3 py-2 font-medium">{trait.name}</td>

              {/* 🧩 Display Order */}
              <td className="px-3 py-2">{trait.display_order || 0}</td>

              {/* 🧩 Scope */}
              <td className="px-3 py-2">
                {trait.scope === "specific" ? (
                  <span className="text-amber-400 bg-amber-900/30 px-2 py-1 rounded text-xs font-medium">
                    Specific
                  </span>
                ) : (
                  <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded text-xs font-medium">
                    Generic
                  </span>
                )}
              </td>

              {/* 🧩 Actions */}
              <td className="px-3 py-2 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(trait)}
                    className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(trait)}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                  >
                    Delete
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
