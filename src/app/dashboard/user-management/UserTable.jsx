"use client";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function UserTable({ users, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="p-3 text-left">Profile</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Tier</th>
            <th className="p-3 text-left">Character Limit</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
              >
                user not found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {/* 🧩 Profile */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        u.profile_picture
                          ? u.profile_picture.startsWith("http")
                            ? u.profile_picture
                            : `${process.env.NEXT_PUBLIC_MEDIA_URL}${u.profile_picture}`
                          : `${process.env.NEXT_PUBLIC_MEDIA_URL}/profile_picture/Candle.webp`
                      }
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {u.name || "-"}
                    </span>
                  </div>
                </td>

                {/* ✉️ Email */}
                <td className="p-3 text-gray-700 dark:text-gray-300">{u.email}</td>

                {/* 👤 Username */}
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {u.username || "-"}
                </td>

                {/* 🏷️ Role */}
                <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  {u.role}
                </td>

                {/* 🪙 Tier */}
                <td className="p-3 text-gray-800 dark:text-gray-200 capitalize">
                  {u.tier ? u.tier : "Free"}
                </td>

                {/* ⚙️ Character Limit */}
                <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                  {u.character_limit === null
                    ? "Unlimited"
                    : u.character_limit || 0}
                </td>

                {/* 📅 Created */}
                <td className="p-3 text-gray-600 dark:text-gray-400">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </td>

                {/* 🎯 Action */}
                <td className="p-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => onView(u)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(u)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit User"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(u)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
