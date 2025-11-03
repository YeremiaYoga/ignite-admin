"use client";

export default function UserViewModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[420px] p-6">
        <h2 className="text-lg font-bold mb-4">Detail User</h2>
        <div className="flex flex-col gap-3">
          <img
            src={
              user.profile_picture
                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${user.profile_picture}`
                : `${process.env.NEXT_PUBLIC_MEDIA_URL}/profile_picture/Candle.webp`
            }
            alt={user.username}
            className="w-24 h-24 rounded-full mx-auto object-cover border"
          />
          <p><b>Email:</b> {user.email}</p>
          <p><b>Username:</b> {user.username}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Plan:</b> {user.subscription_plan || "-"}</p>
          <p><b>Dibuat:</b> {new Date(user.created_at).toLocaleDateString("id-ID")}</p>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
