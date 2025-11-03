"use client";

export default function ConfirmDeleteModal({ user, onClose, onConfirm }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[380px] p-6">
        <h2 className="text-lg font-bold text-red-600 mb-4">Delete User</h2>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete user <b>{user.username}</b> (
          {user.email})?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
