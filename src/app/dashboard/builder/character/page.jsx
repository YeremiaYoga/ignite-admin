"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import CharacterTable from "./CharacterTable";
import CharacterModal from "./CharacterModal"; // 🟢 import modal

export default function CharacterBuilderPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null); // 🧩 state modal

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/characters`,
          {
            credentials: "include",
          }
        );
        const json = await res.json();
        if (json.success !== false) setCharacters(json);
      } catch (err) {
        console.error("Error fetching characters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const handleDelete = async (ch) => {
    if (!confirm(`Delete ${ch.name}?`)) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters/${ch.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setCharacters((prev) => prev.filter((c) => c.id !== ch.id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleView = (ch) => {
    setSelectedCharacter(ch);
  };

  const closeModal = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1230] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Characters</h1>
        <button
          onClick={() => router.push("/dashboard/builder/character/create")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus size={18} /> Create
        </button>
      </div>

      <CharacterTable
        data={characters}
        loading={loading}
        onView={handleView} // 🟢 panggil modal
        onEdit={(ch) =>
          router.push(`/dashboard/builder/character/edit/${ch.id}`)
        }
        onDelete={handleDelete}
      />

      {selectedCharacter && (
        <CharacterModal character={selectedCharacter} onClose={closeModal} />
      )}
    </div>
  );
}
