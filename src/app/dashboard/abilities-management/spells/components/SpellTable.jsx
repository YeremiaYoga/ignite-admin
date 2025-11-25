"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SpellTable() {
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
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/foundry/spells`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        console.error("❌ Failed to load spells:", res.status, await res.text());
        return;
      }

      const json = await res.json();
      setData(json.items || []);
    } catch (err) {
      console.error("❌ Failed to load spells:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this spell?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/foundry/spells/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) throw new Error(await res.text());
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleExport = async (id, mode) => {
    const m = mode === "raw" ? "raw" : "format";

    try {
      const res = await fetch(
        `${API}/foundry/spells/${id}/export?mode=${m}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      if (!res.ok) {
        alert("Failed to export");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `spell_${id}_${m}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Export failed:", err);
      alert("Export failed");
    }
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
              <th className="py-2 px-2">Level</th>
              <th className="py-2 px-2">School</th>
              <th className="py-2 px-2">Properties</th>
              <th className="py-2 px-2">Range</th>
              <th className="py-2 px-2">Activation</th>
              <th className="py-2 px-2">Duration</th>
              <th className="py-2 px-2">Target</th>
              <th className="py-2 px-2">Compendium</th>
              <th className="py-2 px-2">Source</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-3 text-center text-gray-400">
                  No spell data yet.
                </td>
              </tr>
            ) : (
              data.map((x) => (
                <tr key={x.id} className="border-b border-slate-800">
                  <td className="py-2 px-2">
                    {x.image ? (
                      <img
                        src={x.image}
                        alt={x.name}
                        className="w-12 h-12 object-contain rounded-md border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-700/40 flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-2">{x.name}</td>
                  <td className="py-2 px-2">{x.type || "-"}</td>
                  <td className="py-2 px-2">{x.level ?? "-"}</td>
                  <td className="py-2 px-2">{x.school || "-"}</td>
                  <td className="py-2 px-2 max-w-xs truncate">
                    {x.properties || "-"}
                  </td>
                  <td className="py-2 px-2">{x.range || "-"}</td>
                  <td className="py-2 px-2">{x.activation || "-"}</td>
                  <td className="py-2 px-2">{x.duration || "-"}</td>
                  <td className="py-2 px-2">{x.target || "-"}</td>
                  <td className="py-2 px-2 max-w-xs truncate">
                    {x.compendium_source || "-"}
                  </td>
                  <td className="py-2 px-2">{x.source_book || "-"}</td>

                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExport(x.id, "raw")}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs"
                      >
                        Export Raw
                      </button>
                      <button
                        onClick={() => handleExport(x.id, "format")}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        Export Format
                      </button>
                      <button
                        onClick={() => handleDelete(x.id)}
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
