"use client";

export default function UserViewModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl w-[420px] p-6 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4 text-center">User Details</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={
              user.profile_picture
                ? user.profile_picture
                : `${process.env.NEXT_PUBLIC_MEDIA_URL}/profile_picture/Candle.webp`
            }
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-600 shadow-sm"
          />
          <h3 className="mt-2 text-base font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              📧 Email:
            </span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              🧩 Role:
            </span>{" "}
            {user.role === "superadmin"
              ? "Super Admin"
              : user.role === "admin"
              ? "Admin"
              : "User"}
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              💎 Tier:
            </span>{" "}
            {user.tier || "Free"}
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              🔢 Character Limit:
            </span>{" "}
            {user.character_limit === null
              ? "∞ Unlimited"
              : `${user.character_limit} characters`}
          </p>
          {user.tier_expired_at && (
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                ⏰ Expiration Date:
              </span>{" "}
              {new Date(user.tier_expired_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              📅 Created At:
            </span>{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
