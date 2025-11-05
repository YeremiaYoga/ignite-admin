export default function SpeciesTable({
  species,
  onEdit,
  onDelete,
  onView,
  onOptions,
  onModifier,
}) {
  if (!species?.length)
    return <p className="text-gray-400">No species found.</p>;

  return (
    <div className="overflow-x-auto border border-gray-700 rounded-lg">
      <table className="w-full text-sm text-gray-200">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Image</th>
            <th className="px-3 py-2 text-left">Main Image</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Version</th>
            <th className="px-3 py-2 text-left">Source</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {species.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-700 hover:bg-gray-800/50 transition"
            >
              {/* 🧩 Image */}
              <td className="px-3 py-2">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={`${item.name} img`}
                    className="w-12 h-12 object-cover rounded border border-gray-700 hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-700 text-gray-400 rounded text-xs">
                    None
                  </div>
                )}
              </td>

              {/* 🧩 Main Image */}
              <td className="px-3 py-2">
                {item.main_img ? (
                  <img
                    src={item.main_img}
                    alt={`${item.name} main_img`}
                    className="w-12 h-12 object-cover rounded border border-gray-700 hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-700 text-gray-400 rounded text-xs">
                    None
                  </div>
                )}
              </td>

              {/* 🧩 Name */}
              <td className="px-3 py-2 font-medium text-gray-100">
                {item.name}
              </td>

              {/* 🧩 Version */}
              <td className="px-3 py-2">{item.version || "—"}</td>

              {/* 🧩 Source */}
              <td className="px-3 py-2">{item.source || "—"}</td>

              {/* 🧩 Actions */}
              <td className="px-3 py-2 text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                  {/* ⚙️ Options */}
                  <button
                    onClick={() => onOptions?.(item)}
                    className="px-2 py-1 text-xs bg-amber-600 hover:bg-amber-700 rounded"
                  >
                    Options
                  </button>

                  {/* 🧑 Modifier */}
                  <button
                    onClick={() => onModifier?.(item)}
                    className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => onView?.(item)}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    View
                  </button>

                  {/* ✏️ Edit */}
                  <button
                    onClick={() => onEdit(item)}
                    className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Edit
                  </button>

                  {/* 🗑️ Delete */}
                  <button
                    onClick={() => onDelete(item)}
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
