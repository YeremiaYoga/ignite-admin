export default function TokenBorderTable({
  borders,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-lg overflow-hidden shadow-lg">

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="bg-slate-800">
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!borders || borders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No token borders yet.
                </td>
              </tr>
            ) : (
              borders.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-md bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                      {b.image_url ? (
                        <img
                          src={b.image_url}
                          alt={b.name || "border"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-500">
                          No Image
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">{b.name}</td>

                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {b.description || "-"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.is_paid
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {b.is_paid ? "Paid" : "Free"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => onView?.(b)}
                      className="px-2 py-1 text-xs rounded border border-slate-500/60 text-slate-200 hover:bg-slate-500/10"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit?.(b)}
                      className="px-2 py-1 text-xs rounded border border-sky-500/60 text-sky-300 hover:bg-sky-500/10"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete?.(b)}
                      className="px-2 py-1 text-xs rounded border border-red-500/60 text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
