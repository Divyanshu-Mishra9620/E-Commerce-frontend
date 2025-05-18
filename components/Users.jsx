"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  User,
  Mail,
  Key,
  Calendar,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Users() {
  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchId, setSearchId] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/api/users`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch users");
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = users
    .filter((u) =>
      searchEmail
        ? u.email.toLowerCase().includes(searchEmail.toLowerCase())
        : true
    )
    .filter((u) => (searchId ? u._id === searchId.trim() : true));

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URI}/api/users/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDeleteUser(null);
    } catch (err) {
      setError(err.message);
      setDeleteUser(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-red-900 to-red-700 p-6 rounded-xl shadow-xl text-center"
        >
          <h2 className="text-xl font-bold text-red-100 mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
        </motion.div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 text-gray-100">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-6 text-amber-400">
          User Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-amber-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-100 placeholder-gray-500 overflow-x-auto text-ellipsis"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-amber-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-100 placeholder-gray-500 overflow-x-auto text-ellipsis"
            />
          </div>
        </div>
      </motion.div>

      {/* Users List */}
      <div className="grid gap-6">
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-amber-400 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-700 p-3 rounded-full">
                        <User className="h-6 w-6 text-amber-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-amber-400">
                        {user.name || "N/A"}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Key className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">User ID</p>
                          <p className="text-gray-300 font-mono">{user._id}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-gray-300">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-700 px-2 py-1 rounded text-xs text-amber-400">
                          {user.role}
                        </div>
                      </div>

                      {user.address && (
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-400">Address</p>
                            <p className="text-gray-300">{`${user.address.street}, ${user.address.city}`}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">Joined</p>
                          <p className="text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
                    <button
                      onClick={() => setDeleteUser(user)}
                      className="p-2 bg-red-900/50 hover:bg-red-900 rounded-lg transition flex items-center justify-center group"
                    >
                      <Trash2 className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                      <span className="ml-2 md:hidden lg:inline text-red-300">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 text-center"
            >
              <Search className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl text-gray-400">No users found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search criteria
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteUser && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 mb-4">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-gray-400">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-medium text-amber-400">
                    {deleteUser.name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={() => setDeleteUser(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(deleteUser._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-lg transition flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
