"use client";

import { useRouter } from "next/navigation";

export default function CharacterBuilderPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b1230] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Characters</h1>
        <button
          onClick={() => router.push("/dashboard/builder/character/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Create
        </button>
      </div>

      {/* Content */}
      <div className="border border-slate-700 rounded-lg p-6 text-center text-gray-400">
        in Progress...
      </div>
    </div>
  );
}
