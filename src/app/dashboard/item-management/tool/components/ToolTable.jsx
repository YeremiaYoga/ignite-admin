"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ToolTable() {
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

      const res = await fetch(`${API}/foundry/tools`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

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
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) throw new Error(await res.text());

      setData((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleExport = async (id, mode) => {
    const m = mode === "raw" ? "raw" : "format";

    try {
      const res = await fetch(`${API}/foundry/tools/${id}/export?mode=${m}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        console.error("❌ Export failed:", res.status, await res.text());
        alert("Failed to export");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `tool_${id}_${m}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Export failed:", err);
      alert("Export failed");
    }
  };

  const resolveImage = (row) => {
    if (row.image) return row.image;
    if (row.format_data?.img) return row.format_data.img;
    return null;
  };

  const formatPrice = (p) => {
    if (p == null) return "-";
    return `${p.toLocaleString("en-US")} cp`;
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
              <th className="py-2 px-2">Base Item</th>
              <th className="py-2 px-2">Tool Type</th>
              <th className="py-2 px-2">Rarity</th>
              <th className="py-2 px-2">Attunement</th>
              <th className="py-2 px-2">Price</th>
              <th className="py-2 px-2">Compendium</th>
              <th className="py-2 px-2">Source</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-3 text-center text-gray-400">
                  No tool data yet.
                </td>
              </tr>
            ) : (
              data.map((t) => {
                const imgSrc = resolveImage(t);

                return (
                  <tr key={t.id} className="border-b border-slate-800">
                    {/* IMAGE */}
                    <td className="py-2 px-2">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={t.name}
                          className="w-12 h-12 object-contain rounded-md border border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-slate-700/40 flex items-center justify-center text-[10px] text-gray-400">
                          No Img
                        </div>
                      )}
                    </td>

                    {/* NAME */}
                    <td className="py-2 px-2">{t.name}</td>

                    {/* TYPE */}
                    <td className="py-2 px-2">{t.type || "-"}</td>

                    {/* BASE ITEM */}
                    <td className="py-2 px-2">{t.base_item || "-"}</td>

                    {/* TOOL TYPE */}
                    <td className="py-2 px-2">{t.type_value || "-"}</td>

                    {/* RARITY */}
                    <td className="py-2 px-2">{t.rarity || "-"}</td>

                    {/* ATTUNEMENT */}
                    <td className="py-2 px-2">{t.attunement || "-"}</td>

                    {/* PRICE (CP) */}
                    <td className="py-2 px-2">{formatPrice(t.price)}</td>

                    {/* COMPENDIUM SOURCE */}
                    <td className="py-2 px-2 max-w-xs truncate">
                      {t.compendium_source || "-"}
                    </td>

                    {/* SOURCE BOOK */}
                    <td className="py-2 px-2">{t.source_book || "-"}</td>

                    {/* ACTIONS */}
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExport(t.id, "raw")}
                          className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs"
                        >
                          Export Raw
                        </button>
                        <button
                          onClick={() => handleExport(t.id, "format")}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                        >
                          Export Format
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
