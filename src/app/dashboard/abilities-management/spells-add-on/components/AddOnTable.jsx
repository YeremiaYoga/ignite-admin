"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AddOnTable({ onOpenModal, refresh, search = "" }) {
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
  }, [refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/foundry/spells`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });

      const json = await res.json();
      setData(json.items || []);
    } catch (err) {
      console.error("Load spells failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const format = (v) => {
    if (!v) return "-";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "-";
    return String(v);
  };

  const formatHomebrew = (sp) => {
    // kalau backend kamu sudah join homebrew: { id,name,code } (seperti ignite controller)
    if (sp?.homebrew?.code) return sp.homebrew.code;
    if (sp?.homebrew?.name) return sp.homebrew.name;

    // fallback kalau cuma ada homebrew_id
    if (sp?.homebrew_id) return `#${String(sp.homebrew_id).slice(0, 8)}`;
    return "-";
  };

  const ACTION_FIELDS = [
    { key: "classes", label: "Classes", api: "classes", method: "PUT" },
    { key: "damage_type", label: "Damage Type", api: "damage-type", method: "PUT" },

    // ✅ NEW: Homebrew
    { key: "homebrew_id", label: "Homebrew", api: "homebrew-source", method: "PATCH" },
  ];

  const searchText = search.toLowerCase().trim();

  const filtered = !searchText
    ? data
    : data.filter((sp) => {
        const name = (sp.name || "").toLowerCase();
        const classes = format(sp.classes).toLowerCase();
        const dmg = format(sp.damage_type).toLowerCase();
        const hb = formatHomebrew(sp).toLowerCase();
        return (
          name.includes(searchText) ||
          classes.includes(searchText) ||
          dmg.includes(searchText) ||
          hb.includes(searchText)
        );
      });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-700 rounded-xl p-4 shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="py-2 px-2">Image</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Classes</th>
              <th className="py-2 px-2">Damage Type</th>

              {/* ✅ NEW */}
              <th className="py-2 px-2">Homebrew</th>

              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-3 text-center text-gray-400">
                  No data found.
                </td>
              </tr>
            ) : (
              filtered.map((sp) => (
                <tr key={sp.id} className="border-b border-slate-800">
                  {/* Image */}
                  <td className="py-2 px-2">
                    {sp.image ? (
                      <img
                        src={sp.image}
                        alt={sp.name}
                        className="w-12 h-12 object-contain rounded-md border border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-700/40 flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-2 font-medium">{sp.name}</td>

                  <td className="py-2 px-2 max-w-xs truncate">
                    {format(sp.classes)}
                  </td>

                  <td className="py-2 px-2 max-w-xs truncate">
                    {format(sp.damage_type)}
                  </td>

                  {/* ✅ NEW */}
                  <td className="py-2 px-2 max-w-xs truncate">
                    {formatHomebrew(sp)}
                  </td>

                  <td className="py-2 px-2">
                    <div className="flex flex-wrap gap-2">
                      {ACTION_FIELDS.map((btn) => (
                        <button
                          key={btn.key}
                          onClick={() => onOpenModal?.(sp, btn)}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs"
                        >
                          {btn.label}
                        </button>
                      ))}
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
