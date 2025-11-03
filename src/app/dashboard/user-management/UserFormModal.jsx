"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import ImagePicker from "@/components/ImagePicker"; // optional — ganti dengan komponen kamu sendiri

export default function UserFormModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    id: user?.id || "",
    username: user?.username || "",
    name: user?.name || "",
    role: user?.role || "user",
    password: "",
    character_limit: user?.character_limit || 5,
    subscription_plan: user?.subscription_plan || "free",
    subscription_expiry: user?.subscription_expiry || "",
    profile_picture:
      user?.profile_picture ||
      `${process.env.NEXT_PUBLIC_MEDIA_URL}/profile_picture/Candle.webp`,
  });

  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[420px] p-6">
        <h2 className="text-lg font-bold mb-4">
          {user ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={form.profile_picture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="mt-2 inline-flex items-center gap-2 px-3 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              <ImagePlus className="w-4 h-4" />
              Change Picture
            </button>
          </div>

          {/* Username */}
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
              required
            />
          </div>

          {/* Password */}
          {!user && (
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
                placeholder="Enter new password"
                required={!user}
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          {/* Character Limit */}
          <div>
            <label className="block font-medium mb-1">Character Limit</label>
            <input
              type="number"
              min="0"
              value={form.character_limit}
              onChange={(e) =>
                handleChange("character_limit", parseInt(e.target.value) || 0)
              }
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
            />
          </div>

          {/* Subscription Plan */}
          <div>
            <label className="block font-medium mb-1">Subscription Plan</label>
            <select
              value={form.subscription_plan}
              onChange={(e) =>
                handleChange("subscription_plan", e.target.value)
              }
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Subscription Expiry */}
          <div>
            <label className="block font-medium mb-1">Subscription Expiry</label>
            <input
              type="date"
              value={form.subscription_expiry || ""}
              onChange={(e) =>
                handleChange("subscription_expiry", e.target.value)
              }
              className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Image Picker */}
      {showImagePicker && (
        <ImagePicker
          isOpen={showImagePicker}
          baseUrl={`${process.env.NEXT_PUBLIC_MEDIA_URL}/profile/list`}
          title="Select Profile Picture"
          onSelect={(url) => {
            handleChange("profile_picture", url);
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}
