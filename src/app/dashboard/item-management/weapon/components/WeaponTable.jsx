"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function WeaponTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/foundry/weapons`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      const json = await res.json();
      setData(json.items || []);
      console.log(json);
    } catch (err) {
      console.error("❌ Failed to load weapons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this weapon?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/foundry/weapons/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setData((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleExport = (id, mode) => {
    const m = mode === "raw" ? "raw" : "format";

    const token = localStorage.getItem("admin_token");
    if (!token) return alert("Missing admin token");

    window.open(
      `${API}/foundry/weapons/${id}/export?mode=${m}&token=${token}`,
      "_blank"
    );
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
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-3 px-2 text-center text-gray-500" colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-3 text-center text-gray-400">
                  No weapon data yet.
                </td>
              </tr>
            ) : (
              data.map((w) => (
                <tr key={w.id} className="border-b border-slate-800">
                  {/* IMAGE */}
                  <td className="py-2 px-2">
                    {w.format_data.img ? (
                      <img
                        src={w.format_data.img}
                        alt={w.name}
                        className="w-12 h-12 object-contain rounded-md border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-700/40 flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  {/* NAME */}
                  <td className="py-2 px-2">{w.name}</td>

                  {/* TYPE */}
                  <td className="py-2 px-2">{w.type}</td>

                  {/* ACTIONS */}
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExport(w.id, "raw")}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs"
                      >
                        Export Raw
                      </button>

                      <button
                        onClick={() => handleExport(w.id, "format")}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        Export Format
                      </button>

                      <button
                        onClick={() => handleDelete(w.id)}
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
