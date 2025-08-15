"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Key, Trash2, Search } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "react-hot-toast";
import { authedFetch } from "@/utils/authedFetch";
import { Modal } from "@/components/Modals";

const UserSearch = ({ searchTerm, onSearchChange }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by user name or email..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

const UserCard = ({ user, onDeleteClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          user.role === "admin"
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {user.role}
      </span>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
      <button
        onClick={onDeleteClick}
        className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </motion.div>
);

export default function Users() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { users, totalPages, isLoading, error, mutate } = useUsers(
    page,
    searchTerm
  );

  const [deleteUser, setDeleteUser] = useState(null);

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await authedFetch(`/api/users/delete/${deleteUser._id}`, {
        method: "DELETE",
      });
      toast.success(`User ${deleteUser.name} deleted.`);
      mutate();
      setDeleteUser(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (error)
    return <div className="text-red-500 p-4">Error loading users.</div>;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <UserSearch
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onDeleteClick={() => setDeleteUser(user)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteUser?.name}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setDeleteUser(null)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
