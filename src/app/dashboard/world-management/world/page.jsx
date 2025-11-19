"use client";

import { useEffect, useState } from "react";
import WorldTable from "./components/WorldTable";
import WorldFormModal from "./components/WorldFormModal";
import WorldManageModal from "./components/WorldManageModal";

const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

// 🔑 JSON / normal fetch (no files)
function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔑 FormData fetch (multipart) – JANGAN set Content-Type
function getAuthHeadersFormData() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function WorldManagementPage() {
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);

  // 🔹 Manage (step 2)
  const [showManage, setShowManage] = useState(false);
  const [manageWorld, setManageWorld] = useState(null);

  const [form, setForm] = useState({
    name: "",
    short_name: "",
    private: false,
    password: "",
    icon: null, // <input name="icon" type="file" />
    banner: null, // <input name="banner" type="file" />
    platforms: [],
    game_systems: [],
    languages: [],
  });

  // ---------- FETCH LIST ----------
  const fetchWorlds = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/admin/worlds`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch worlds: ${res.status}`);
      }

      const json = await res.json();
      // dukung response { data: [...] } atau langsung array
      const data = Array.isArray(json.data) ? json.data : json || [];
      setWorlds(data);
    } catch (err) {
      console.error("💥 fetchWorlds error:", err);
      setError("Failed to load world list. Please re-login as admin.");
      alert("❌ Failed to load world list. Please re-login as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorlds();
  }, []);

  // ---------- FORM HELPERS ----------
  const openCreate = () => {
    setIsEdit(false);
    setSelectedWorld(null);
    setForm({
      name: "",
      short_name: "",
      private: false,
      password: "",
      icon: null,
      banner: null,
      platforms: [],
      game_systems: [],
      languages: [],
    });
    setShowForm(true);
  };

  const openEdit = (world) => {
    setIsEdit(true);
    setSelectedWorld(world);
    setForm({
      name: world.name || "",
      short_name: world.short_name || "",
      private: !!world.private,
      password: "",
      icon: null,
      banner: null,
      // diasumsikan sudah array of id / value (bukan objek)
      platforms: Array.isArray(world.platforms) ? world.platforms : [],
      game_systems: Array.isArray(world.game_systems) ? world.game_systems : [],
      languages: Array.isArray(world.languages) ? world.languages : [],
    });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setSelectedWorld(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePrivate = () => {
    setForm((prev) => ({ ...prev, private: !prev.private }));
  };

  // ---------- SAVE (CREATE / UPDATE) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const fd = new FormData();

      const platforms = Array.isArray(form.platforms) ? form.platforms : [];
      const gameSystems = Array.isArray(form.game_systems)
        ? form.game_systems
        : [];
      const languages = Array.isArray(form.languages) ? form.languages : [];

      const payload = {
        name: form.name.trim(),
        short_name: form.short_name.trim() || null,
        private: form.private,
        platforms,
        game_systems: gameSystems,
        languages,
      };

      // kirim password hanya saat create / user isi baru di edit
      if (!isEdit || (isEdit && form.password.trim() !== "")) {
        payload.password = form.password.trim();
      }

      fd.append("data", JSON.stringify(payload));

      if (form.icon) fd.append("icon", form.icon);
      if (form.banner) fd.append("banner", form.banner);

      const url = isEdit
        ? `${API_BASE}/admin/worlds/${selectedWorld.id}`
        : `${API_BASE}/admin/worlds`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeadersFormData(),
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        console.error("❌ save world failed:", msg);
        throw new Error(`Failed to save world: ${res.status}`);
      }

      await res.json();
      await fetchWorlds();
      alert("✅ World saved successfully");
      closeForm();
    } catch (err) {
      console.error("💥 saveWorld error:", err);
      setError("Failed to save world. Please try again.");
      alert("❌ Failed to save world.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (world) => {
    const ok = window.confirm(
      `Delete world "${world.name}"? Icon & banner media will also be removed.`
    );
    if (!ok) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/admin/worlds/${world.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to delete world: ${res.status}`);
      }

      await fetchWorlds();
    } catch (err) {
      console.error("💥 deleteWorld error:", err);
      setError("Failed to delete world.");
      alert("❌ Failed to delete world.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- MANAGE (STEP 2) ----------
  const openManage = (world) => {
    setManageWorld(world);
    setShowManage(true);
  };

  const closeManage = () => {
    setShowManage(false);
    setManageWorld(null);
  };

  return (
    <div className="px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">
            World Management
          </h1>
        
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow"
        >
          + Add World
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* World table */}
      <WorldTable
        worlds={worlds}
        loading={loading}
        onEdit={openEdit}
        onManage={openManage}
        onDelete={handleDelete}
      />

      {/* Create / Edit modal */}
      <WorldFormModal
        open={showForm}
        isEdit={isEdit}
        world={selectedWorld}
        form={form}
        saving={saving}
        onChange={handleChange}
        onTogglePrivate={togglePrivate}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      {/* Manage (step 2) modal */}
      {showManage && manageWorld && (
        <WorldManageModal
          world={manageWorld}
          onClose={closeManage}
          onSaved={fetchWorlds}
        />
      )}
    </div>
  );
}
