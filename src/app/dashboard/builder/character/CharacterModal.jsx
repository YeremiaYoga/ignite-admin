"use client";

import { X } from "lucide-react";

export default function CharacterModal({ character, onClose }) {
  if (!character) return null;

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-slate-800 py-1 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200 text-right">{value || "-"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl p-6 relative shadow-xl">
        {/* === Tombol Tutup === */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* === Header === */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={character.token_image || "/assets/default_token.webp"}
            alt="Token"
            className="w-16 h-16 object-cover rounded-full border border-slate-700"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{character.name}</h2>
            <p className="text-sm text-gray-400">
              Creator:{" "}
              <span className="text-gray-200">
                {character.creator_name || character.owner_name || "Unknown"}
              </span>
            </p>
          </div>
        </div>

        {/* === Art Image === */}
        {character.art_image && (
          <img
            src={character.art_image}
            alt="Character Art"
            className="w-full h-auto rounded-lg border border-slate-800 mb-4"
          />
        )}

        {/* === Flat Info Table === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InfoRow label="Character Type" value={character.character_type} />
          <InfoRow label="Alignment" value={character.alignment} />
          <InfoRow label="Status" value={character.status} />
          <InfoRow label="Race" value={character.race_name} />
          <InfoRow label="Background" value={character.background_name} />
          <InfoRow label="Combat Style" value={character.incumbency_name} />
          <InfoRow label="Gender" value={character.gender} />
          <InfoRow label="Pronoun" value={character.pronoun} />
          <InfoRow label="Birth Place" value={character.birth_place} />
          <InfoRow label="Country" value={character.birth_country} />
          <InfoRow label="Vision" value={character.vision} />
          <InfoRow label="Disposition" value={character.disposition} />
          <InfoRow label="Damage Type" value={character.damage_type} />
          <InfoRow label="Nationality" value={character.nationality} />
          <InfoRow
            label="Height"
            value={
              character.height?.centimeter
                ? `${character.height.centimeter} cm`
                : "-"
            }
          />
          <InfoRow
            label="Weight"
            value={
              character.weight?.kilogram
                ? `${character.weight.kilogram} kg`
                : "-"
            }
          />
          <InfoRow label="Skin Colour" value={character.skin_colour} />
          <InfoRow label="Hair" value={character.hair} />
          <InfoRow label="STR" value={character.str} />
          <InfoRow label="DEX" value={character.dex} />
          <InfoRow label="CON" value={character.con} />
          <InfoRow label="INT" value={character.int} />
          <InfoRow label="WIS" value={character.wis} />
          <InfoRow label="CHA" value={character.cha} />
        </div>

        {/* === Backstory / Personality Singkat === */}
        {character.backstory && (
          <div className="mt-5">
            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
              {character.backstory}
            </p>
          </div>
        )}

        {/* === Footer === */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded shadow text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
