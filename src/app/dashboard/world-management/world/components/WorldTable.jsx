export default function WorldTable({ worlds, loading, onEdit, onDelete }) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-gray-200">World List</h2>
        {loading && (
          <span className="text-xs text-gray-400 animate-pulse">
            Loading...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Short Name</th>
              <th className="px-3 py-2 text-left">Private</th>
              <th className="px-3 py-2 text-left">Heralds</th>
              <th className="px-3 py-2 text-left">World ID</th>
              <th className="px-3 py-2 text-left">Public ID</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!worlds || worlds.length === 0) ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-gray-400"
                >
                  No worlds yet.
                </td>
              </tr>
            ) : (
              worlds.map((w) => (
                <tr
                  key={w.id}
                  className="border-t border-slate-800 hover:bg-slate-800/60"
                >
                  <td className="px-3 py-2">{w.name}</td>
                  <td className="px-3 py-2">{w.short_name || "-"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        w.private
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {w.private ? "Private" : "Public"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {w.heralds ? (
                      <span className="text-emerald-300 text-xs font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {w.world_id}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {w.public_id}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                    //   onClick={() => onEdit?.(w)}
                      className="px-2 py-1 text-xs rounded border border-sky-500/60 text-sky-300 hover:bg-sky-500/10"
                    >
                      Edit
                    </button>
                    <button
                    //   onClick={() => onDelete?.(w)}
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
