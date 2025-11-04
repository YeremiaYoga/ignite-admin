"use client";

import { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";
import ImagePicker from "@/components/ImagePicker";

export default function UserFormModal({ user, onClose, onSave }) {
  const [tiers, setTiers] = useState([]);
  const [loadingTiers, setLoadingTiers] = useState(true);

  const [form, setForm] = useState({
    id: user?.id || "",
    email: user?.email || "",
    username: user?.username || "",
    name: user?.name || "",
    role: user?.role || "user",
    password: "",
    tier_id: user?.tier_id || "",
    tier: user?.tier || "free",
    character_limit: user?.character_limit ?? 5,
    profile_picture:
      user?.profile_picture ||
      `${process.env.NEXT_PUBLIC_MEDIA_URL}/profile_picture/Candle.webp`,
  });

  const [showImagePicker, setShowImagePicker] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🧩 Ambil semua tiers
  useEffect(() => {
    async function fetchTiers() {
      try {
        const res = await fetch(`${API_URL}/tiers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const json = await res.json();
        if (json.success) setTiers(json.data || []);
      } catch (err) {
        console.error("❌ Fetch tiers error:", err);
      } finally {
        setLoadingTiers(false);
      }
    }
    fetchTiers();
  }, [API_URL]);

  // 🧠 Handle form change
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔄 Saat memilih tier, otomatis isi tier_id, tier name, dan character limit
  const handleTierChange = (tierId) => {
    const selectedTier = tiers.find((t) => t.id === tierId);
    if (selectedTier) {
      setForm((prev) => ({
        ...prev,
        tier_id: selectedTier.id,
        tier: selectedTier.slug,
        character_limit: selectedTier.is_unlimited
          ? null
          : selectedTier.character_limit,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        tier_id: "",
        tier: "free",
        character_limit: 5,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl w-[420px] p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">
          {user ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {/* 🖼️ Profile Picture */}
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

          {/* 📧 Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
              placeholder="user@example.com"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
              placeholder="username"
              required
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
              placeholder="Name"
              required
            />
          </div>

          {/* Password (only for new user) */}
          {!user && (
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                placeholder="Enter password"
                required
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          {/* Tier Selector */}
          <div>
            <label className="block font-medium mb-1">Tier</label>
            <select
              value={form.tier_id || ""}
              onChange={(e) => handleTierChange(e.target.value)}
              disabled={loadingTiers}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
            >
              {loadingTiers ? (
                <option>Loading tiers...</option>
              ) : (
                <>
                  <option value="">Free</option>
                  {tiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}{" "}
                      {t.is_unlimited
                        ? " (Unlimited)"
                        : ` (${t.character_limit})`}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Character Limit (readonly) */}
          <div>
            <label className="block font-medium mb-1">Character Limit</label>
            <input
              type="text"
              value={
                form.character_limit === null
                  ? "∞ Unlimited"
                  : form.character_limit
              }
              readOnly
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {/* 🖼️ Image Picker Modal */}
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
