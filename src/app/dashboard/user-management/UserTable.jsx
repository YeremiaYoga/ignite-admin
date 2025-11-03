"use client";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function UserTable({ users, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="p-3 text-left">Profile</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Plan</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
              >
                Tidak ada data user.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        u.profile_picture
                          ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${u.profile_picture}`
                          : `${process.env.NEXT_PUBLIC_MEDIA_URL}/profile_picture/Candle.webp`
                      }
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                    <span className="font-semibold">{u.name || "-"}</span>
                  </div>
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.username || "-"}</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {u.role}
                </td>
                <td className="p-3">{u.subscription_plan || "-"}</td>
                <td className="p-3">
                  {new Date(u.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button onClick={() => onView(u)} className="text-gray-500 hover:text-gray-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(u)} className="text-blue-500 hover:text-blue-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(u)} className="text-red-500 hover:text-red-700">
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
