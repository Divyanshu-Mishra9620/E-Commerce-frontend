"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Search,
  Activity,
  Package,
  AlertCircle,
} from "lucide-react";

export default function Sellers() {
  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/api/sellers`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch sellers");

        setSellers(data.sellers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const filteredSellers = sellers
    .filter(
      (seller) =>
        seller.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  if (loading)
    return (
      <div className="max-w-5xl mx-auto p-8 grid gap-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="h-24 bg-gray-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="p-4 bg-red-900/30 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-400" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-red-400">Loading Error</h2>
          <p className="text-gray-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-800 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">
            Seller Management
          </h1>
          <p className="text-gray-600">Manage and review registered sellers</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 outline-none text-gray-300"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </motion.header>

      {/* Content Section */}
      {filteredSellers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[40vh] gap-4 text-center"
        >
          <div className="p-4 bg-indigo-900/30 rounded-full">
            <Package className="h-12 w-12 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">No Sellers Found</h2>
          <p className="text-gray-400 max-w-md">
            {searchQuery
              ? "No matching sellers found."
              : "Start by registering new sellers."}
          </p>
        </motion.div>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredSellers.map((user) => (
            <motion.li
              key={user?._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all"
            >
              <div className="space-y-4">
                {/* Seller Header */}
                <div className="flex items-start justify-between flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-900/20 p-2.5 rounded-lg">
                      <User className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">
                        {user.name || "Unnamed Seller"}
                      </h3>
                      <p className="text-sm text-indigo-400">
                        Seller ID: #{user?._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300 max-h-30">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Seller Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <a
                      href={`mailto:${user.email}`}
                      className="text-gray-300 hover:text-indigo-400 transition-colors break-all"
                    >
                      {user.email}
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Last Active:</span>
                        <span className="text-gray-400">2h ago</span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-700/30 rounded-lg ">
                      <div className="flex items-center gap-2 text-sm max-h-12 flex-wrap">
                        <Package className="h-4 w-4 text-amber-400" />
                        <span className="text-gray-300">Products:</span>
                        <span className="text-gray-400">24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
