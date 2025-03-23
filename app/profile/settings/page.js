"use client";

import React, { useState, useEffect } from "react";
import { Lock, Bell, MapPin, Globe, LogOut } from "lucide-react";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

function Settings() {
  const [security] = useState({ twoFactorAuth: true });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressUpdated, setIsAddressUpdated] = useState(true);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    currency: "INR",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URI}/api/users/email/${user?.email}`
        );
        if (!res.ok) throw new Error("No user found");
        const data = await res.json();
        setAddress(data.address || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (isAddressUpdated && user?.email) {
      fetchUserData();
      setIsAddressUpdated(false);
    }
  }, [isAddressUpdated, user?.email]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      const res = await fetch(`${BACKEND_URI}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!res.ok) throw new Error("Failed to update address");

      const data = await res.json();
      console.log("Address updated:", data);

      setIsAddressUpdated(true);
      closeModal();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await signOut({ callbackUrl: "/api/auth/signin" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Navbar />

      <div className="mt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-6"
        >
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-600" /> Security
              </h2>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Two-Factor Authentication
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        readOnly
                        checked={security.twoFactorAuth}
                      />
                      <span className="slider bg-gray-300 before:bg-white"></span>
                    </label>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-600" /> Notifications
              </h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          name={key}
                          checked={value}
                          onChange={handleNotificationChange}
                        />
                        <span className="slider bg-gray-300 before:bg-white"></span>
                      </label>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" /> Address Book
              </h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="space-y-2 text-gray-600">
                  {Object.entries(address || {})?.map(([key, value]) => (
                    <p key={key} className="capitalize">
                      {key}:{" "}
                      <span className="text-gray-800">{value || "-"}</span>
                    </p>
                  ))}
                </div>
                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  Edit Address
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg mx-2"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Edit Address
                    </h2>
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      {/* Street */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={address.street || ""}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={address.city || ""}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={address.postalCode || ""}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={address.state || ""}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={address.country || ""}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" /> Preferences
              </h2>
              <div className="space-y-6">
                {Object.entries(preferences).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3 capitalize">
                      {key}
                    </label>
                    <select
                      name={key}
                      value={value}
                      onChange={handlePreferenceChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={value} className="bg-white">
                        {value}
                      </option>
                    </select>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleLogout}
                className="w-full px-6 py-3.5 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-3"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default withAuth(Settings);
