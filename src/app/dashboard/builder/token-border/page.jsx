"use client";

import { useEffect, useState } from "react";
import TokenBorderTable from "./components/TokenBorderTable";
import TokenBorderFormModal from "./components/TokenBorderFormModal";

const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getAuthHeadersFormData() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function TokenBorderManagementPage() {
  const [borders, setBorders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [selectedBorder, setSelectedBorder] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    is_paid: false,
    release_date: "",
  });

  // ---------- FETCH LIST ----------
  const fetchBorders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/admin/token-borders`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch token borders: ${res.status}`);
      }

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : json || [];
      setBorders(data);
    } catch (err) {
      console.error("💥 fetchBorders error:", err);
      setError("Failed to load token border list. Please re-login as admin.");
      alert("❌ Failed to load token border list. Please re-login as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorders();
  }, []);

  // ---------- FORM HELPERS ----------
  const openCreate = () => {
    setIsEdit(false);
    setViewOnly(false);
    setSelectedBorder(null);
    setForm({
      name: "",
      description: "",
      image: null,
      is_paid: false,
      release_date: "",
    });
    setShowForm(true);
  };

  const openEdit = (border) => {
    setIsEdit(true);
    setViewOnly(false);
    setSelectedBorder(border);
    setForm({
      name: border.name || "",
      description: border.description || "",
      image: null,
      is_paid: !!border.is_paid,
      release_date: border.release_date || "",
    });
    setShowForm(true);
  };

  const openView = (border) => {
    setIsEdit(false);
    setViewOnly(true);
    setSelectedBorder(border);
    setForm({
      name: border.name || "",
      description: border.description || "",
      image: null,
      is_paid: !!border.is_paid,
      release_date: border.release_date || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setSelectedBorder(null);
    setViewOnly(false);
    setIsEdit(false);
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

  const togglePaid = () => {
    setForm((prev) => ({ ...prev, is_paid: !prev.is_paid }));
  };

  // ---------- SAVE (CREATE / UPDATE) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewOnly) {
      closeForm();
      return;
    }

    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const fd = new FormData();

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        is_paid: form.is_paid,
        release_date: form.release_date || null,
      };

      fd.append("data", JSON.stringify(payload));
      if (form.image) fd.append("image", form.image);

      const url = isEdit
        ? `${API_BASE}/admin/token-borders/${selectedBorder.id}`
        : `${API_BASE}/admin/token-borders`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeadersFormData(),
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        console.error("❌ save token border failed:", msg);
        throw new Error(`Failed to save token border: ${res.status}`);
      }

      await res.json();
      await fetchBorders();
      alert("✅ Token border saved successfully");
      closeForm();
    } catch (err) {
      console.error("💥 saveTokenBorder error:", err);
      setError("Failed to save token border. Please try again.");
      alert("❌ Failed to save token border.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (border) => {
    const ok = window.confirm(
      `Delete token border "${border.name}"? Its image media will also be removed.`
    );
    if (!ok) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/admin/token-borders/${border.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to delete token border: ${res.status}`);
      }

      await fetchBorders();
    } catch (err) {
      console.error("💥 deleteTokenBorder error:", err);
      setError("Failed to delete token border.");
      alert("❌ Failed to delete token border.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">
            Token Border Management
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow"
        >
          + Add Token Border
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <TokenBorderTable
        borders={borders}
        loading={loading}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {/* Form modal (Create / Edit / View) */}
      <TokenBorderFormModal
        open={showForm}
        isEdit={isEdit}
        viewOnly={viewOnly}
        border={selectedBorder}
        form={form}
        saving={saving}
        onChange={handleChange}
        onTogglePaid={togglePaid}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
