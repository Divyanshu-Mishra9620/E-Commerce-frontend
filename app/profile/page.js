"use client";
import React, { useState, useEffect } from "react";
import OrderCarousel from "@/components/OrderCarousel";
import { MapPin, User } from "lucide-react";
import "@/app/_styles/global.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CyberLoader from "@/components/CyberLoader";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetchedAddress, setHasFetchedAddress] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchUserData = async (userEmail) => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/api/users/email/${userEmail}`
      );
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      if (data.address) {
        setAddress(data.address);
        setHasFetchedAddress(true);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/api/auth/signin");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        await fetchUserData(userData.email);
      } catch (error) {
        setError("Invalid user data");
        localStorage.removeItem("user");
        router.push("/api/auth/signin");
      }
    };

    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {isLoading ? (
        <CyberLoader />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Profile
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-400" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    />
                  </div>

                  <button
                    onClick={() => router.push("/forgot-password")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-gray-400" />
                  Address
                </h2>

                <div className="space-y-4">
                  {Object.entries(address).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={value}
                        disabled
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-8">
                Your Orders
              </h2>
              <OrderCarousel />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
