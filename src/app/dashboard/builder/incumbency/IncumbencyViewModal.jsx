"use client";
import React from "react";
import { X } from "lucide-react";

export default function IncumbencyViewModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100">
            🧩 {item.name || "Unnamed"}{" "}
            <span className="text-slate-400 text-sm ml-2">
              (v{item.version ?? 1})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image */}
        {item.image && (
          <div className="flex justify-center mb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 object-cover rounded-lg border border-slate-700 shadow"
            />
          </div>
        )}

        {/* General Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-slate-400">Role</p>
            <p className="text-slate-100 capitalize">{item.role || "-"}</p>
          </div>
          <div>
            <p className="text-slate-400">HP Scale</p>
            <p className="text-slate-100">{item.hp_scale ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400">CV Minimum</p>
            <p className="text-slate-100">{item.cv_minimum ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400">CV Flat Cost</p>
            <p className="text-slate-100">{item.cv_flat_cost ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400">CV Percent Cost</p>
            <p className="text-slate-100">{item.cv_percent_cost ?? 0}%</p>
          </div>
          <div>
            <p className="text-slate-400">Initiative Bonus</p>
            <p className="text-slate-100">{item.intivative_bonus ?? 0}</p>
          </div>
          <div>
            <p className="text-slate-400">AC Calc</p>
            <p className="text-slate-100">{item.ac_calc || "-"}</p>
          </div>
          <div>
            <p className="text-slate-400">Alignment</p>
            <p className="text-slate-100">
              {["good", "neutral", "evil", "unknown"]
                .filter((k) => item[k])
                .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                .join(", ") || "-"}
            </p>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mb-6">
            <p className="text-slate-400 mb-1">Description</p>
            <div
              className="text-slate-200 text-sm prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
        )}

        {/* Abilities */}
        {item.abilities && item.abilities.length > 0 && (
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-lg font-semibold mb-3">Abilities</h3>
            <div className="space-y-3">
              {item.abilities.map((ab, idx) => (
                <div
                  key={idx}
                  className="border border-slate-700 rounded-lg p-3 bg-slate-800/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-slate-100">
                      {ab.name || `Ability ${idx + 1}`}
                    </div>
                    <span className="text-xs text-slate-400">
                      {ab.type || "-"} • {ab.cost || "—"}
                    </span>
                  </div>
                  {ab.description && (
                    <div
                      className="text-slate-300 text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: ab.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
