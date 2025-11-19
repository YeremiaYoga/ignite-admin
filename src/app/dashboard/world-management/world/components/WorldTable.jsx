export default function WorldTable({
  worlds,
  loading,
  onEdit,
  onManage,   // ⬅️ tambahkan di sini
  onDelete,
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/40">
        <h2 className="text-sm font-semibold text-gray-100">World List</h2>
        {loading && (
          <span className="text-xs text-gray-400 animate-pulse">
            Loading...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="bg-slate-800">
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Short</th>
              <th className="px-4 py-3">Private</th>
              <th className="px-4 py-3">Heralds</th>
              <th className="px-4 py-3">World ID</th>
              <th className="px-4 py-3">Public ID</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!worlds || worlds.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No worlds yet.
                </td>
              </tr>
            ) : (
              worlds.map((w) => (
                <tr
                  key={w.id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  {/* ICON column */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-md bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                      {w.icon ? (
                        <img
                          src={w.icon}
                          alt="icon"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-500">
                          No Icon
                        </span>
                      )}
                    </div>
                  </td>

                  {/* BANNER column */}
                  <td className="px-4 py-3">
                    <div className="w-28 h-8 rounded-md bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                      {w.banner ? (
                        <img
                          src={w.banner}
                          alt="banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-500">
                          No Banner
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">{w.name}</td>
                  <td className="px-4 py-3">{w.short_name || "-"}</td>

                  {/* PRIVATE */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        w.private
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {w.private ? "Private" : "Public"}
                    </span>
                  </td>

                  {/* HERALDS */}
                  <td className="px-4 py-3">
                    {w.heralds ? (
                      <span className="text-emerald-300 text-xs font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">{w.world_id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{w.public_id}</td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right space-x-2">
                    {/* EDIT = edit data dasar */}
                    <button
                      onClick={() => onEdit?.(w)}
                      className="px-2 py-1 text-xs rounded border border-sky-500/60 text-sky-300 hover:bg-sky-500/10"
                    >
                      Edit
                    </button>

                    {/* MANAGE = step 2 seperti creators, settings lanjutan */}
                    <button
                      onClick={() => onManage?.(w)}
                      className="px-2 py-1 text-xs rounded border border-purple-500/60 text-purple-300 hover:bg-purple-500/10"
                    >
                      Manage
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => onDelete?.(w)}
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
