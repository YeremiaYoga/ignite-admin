"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function FeatTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/foundry/feats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      const json = await res.json();
      setData(json.items || []);
    } catch (err) {
      console.error("❌ Failed to load feats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this feat?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/foundry/feats/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) throw new Error(await res.text());

      setData((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleExport = async (id, mode) => {
    const m = mode === "raw" ? "raw" : "format";

    try {
      const res = await fetch(`${API}/foundry/feats/${id}/export?mode=${m}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        alert("Failed to export");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `feat_${id}_${m}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Export failed:", err);
      alert("Export failed");
    }
  };

  const shortText = (str, max = 80) => {
    if (!str) return "-";
    if (str.length <= max) return str;
    return str.slice(0, max) + "…";
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-700 rounded-xl p-4 shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="py-2 px-2">Image</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Type</th>
              <th className="py-2 px-2">Feat Type</th>
              <th className="py-2 px-2">Subtype</th>
              <th className="py-2 px-2">Requirements</th>
              <th className="py-2 px-2">Source</th>
              <th className="py-2 px-2">Adv.</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-3 text-center text-gray-400">
                  No feat data yet.
                </td>
              </tr>
            ) : (
              data.map((f) => (
                <tr key={f.id} className="border-b border-slate-800">
                  {/* IMG */}
                  <td className="py-2 px-2">
                    {f.image ? (
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-12 h-12 object-contain rounded-md border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-700/40 flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-2">{f.name}</td>
                  <td className="py-2 px-2">{f.type}</td>
                  <td className="py-2 px-2">{f.feat_type || "-"}</td>
                  <td className="py-2 px-2">{f.subtype || "-"}</td>

                  <td className="py-2 px-2 max-w-xs">
                    <span className="block truncate" title={f.requirements}>
                      {shortText(f.requirements || "", 60)}
                    </span>
                  </td>

                  <td className="py-2 px-2">{f.source_book || "-"}</td>

                  <td className="py-2 px-2 text-center">
                    {Array.isArray(f.advancement) ? f.advancement.length : "-"}
                  </td>

                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExport(f.id, "raw")}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs"
                      >
                        Export Raw
                      </button>
                      <button
                        onClick={() => handleExport(f.id, "format")}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        Export Format
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs"
                      >
                        Delete
                      </button>
                    </div>
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
