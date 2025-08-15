"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Search, Trash2 } from "lucide-react";
import { useSellers } from "@/hooks/useSellers";
import { Modal } from "../Modals";

const SellerControls = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search sellers by name or email..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <select
      value={sortBy}
      onChange={onSortChange}
      className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
    </select>
  </div>
);

export default function Sellers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { sellers, totalPages, isLoading, error, mutate } = useSellers(
    page,
    searchTerm,
    sortBy
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
    return <div className="p-4 text-red-500">Failed to load sellers.</div>;
  if (isLoading && sellers.length === 0) return <div>Loading sellers...</div>;

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
        <p className="text-gray-600 mt-1">
          Manage and review all registered sellers on the platform.
        </p>
      </motion.header>

      <SellerControls
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        sortBy={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sellers.map((seller) => (
                <motion.tr
                  key={seller._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seller.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => setDeleteUser(seller)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
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
