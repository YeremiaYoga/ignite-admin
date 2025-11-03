"use client";

import { useState, useEffect } from "react";
import UserTable from "./UserTable";
import UserFormModal from "./UserFormModal";
import UserViewModal from "./UserViewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Loader2, PlusCircle } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null); // "add" | "edit" | "view" | "delete"
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal ambil data user");
      setUsers(json.users || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (type, user = null) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  const handleSave = async (formData) => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${formData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/users`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan user");

      alert(`✅ User ${formData.id ? "diperbarui" : "ditambahkan"}!`);
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal hapus user");
      alert("✅ User berhasil dihapus!");
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            onClick={() => openModal("add")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
          >
            <PlusCircle className="w-5 h-5" />
            Create User
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
          </div>
        ) : (
          <UserTable
            users={users}
            onView={(u) => openModal("view", u)}
            onEdit={(u) => openModal("edit", u)}
            onDelete={(u) => openModal("delete", u)}
          />
        )}
      </div>

      {modalType === "add" || modalType === "edit" ? (
        <UserFormModal
          user={selectedUser}
          onClose={closeModal}
          onSave={handleSave}
        />
      ) : modalType === "view" ? (
        <UserViewModal user={selectedUser} onClose={closeModal} />
      ) : modalType === "delete" ? (
        <ConfirmDeleteModal
          user={selectedUser}
          onClose={closeModal}
          onConfirm={() => handleDelete(selectedUser.id)}
        />
      ) : null}
    </main>
  );
}
