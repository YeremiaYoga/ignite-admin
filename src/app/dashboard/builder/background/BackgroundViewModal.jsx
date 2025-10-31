"use client";
export default function BackgroundViewModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg w-[600px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          ✕
        </button>

        {item.bg_image && (
          <img
            src={item.bg_image}
            alt="Background"
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-3">{item.name}</h2>
        <p className="text-gray-400 mb-2 italic">{item.source}</p>
        <p className="text-gray-200 whitespace-pre-line">
          {item.description || "No description."}
        </p>
      </div>
    </div>
  );
}
