"use client";

export default function FeatViewModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
        <p className="text-gray-400 text-sm mb-4">{item.source}</p>
        <p className="text-gray-200 mb-3 whitespace-pre-line">
          {item.description}
        </p>
        <div className="mt-2">
          {item.tags?.length > 0 &&
            item.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block bg-teal-700/50 text-xs px-2 py-0.5 rounded mr-1"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
