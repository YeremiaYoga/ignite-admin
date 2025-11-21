"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ToolTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/foundry/tools`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        console.error("❌ Failed to load tools:", res.status, await res.text());
        return;
      }

      const json = await res.json();
      setData(json.items || []);
    } catch (err) {
      console.error("❌ Failed to load tools:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this tool?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/foundry/tools/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!res.ok) throw new Error(await res.text());

      setData((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleExport = async (id) => {
    try {
      const res = await fetch(`${API}/foundry/tools/${id}/export?mode=raw`, {
        method: "GET",
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
      a.download = `tool_${id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
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
              <th className="py-2 px-2">Img</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Base Item</th>
              <th className="py-2 px-2">Tool Type</th>
              <th className="py-2 px-2">Rarity</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-3 px-2 text-center text-gray-500" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-3 text-center text-gray-400">
                  No tool data yet.
                </td>
              </tr>
            ) : (
              data.map((t) => (
                <tr key={t.id} className="border-b border-slate-800">
                  <td className="py-2 px-2">
                    {t.format_data ? (
                      <img
                        src={t.format_data.img}
                        alt={t.name}
                        className="w-12 h-12 object-contain rounded border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-700/40 flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-2">{t.name}</td>
                  <td className="py-2 px-2">{t.base_item || "-"}</td>
                  <td className="py-2 px-2">{t.tool_type || "-"}</td>
                  <td className="py-2 px-2">{t.rarity || "-"}</td>

                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExport(t.id)}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs"
                      >
                        Export
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
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
