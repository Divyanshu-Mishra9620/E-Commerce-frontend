"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Key, Calendar } from "lucide-react";

export default function Sellers() {
  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/api/users/sellers`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sellers");
        }

        setSellers(data.sellers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

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
    <div className="max-w-5xl mx-auto p-4 lg:p-8 text-gray-100 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center text-amber-400"
      >
        All Sellers
      </motion.h1>

      {sellers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-900/30 border border-yellow-700 p-6 rounded-xl text-center text-yellow-200 shadow"
        >
          <p className="text-lg font-semibold">No sellers found.</p>
          <p className="text-sm mt-2">Please check back later.</p>
        </motion.div>
      ) : (
        <ul className="grid gap-6">
          {sellers.map((user) => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-amber-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <User className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="text-lg font-semibold text-amber-300">
                    {user.name || "N/A"}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-300 break-words">
                    {user.email || "N/A"}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-300">{user._id}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
