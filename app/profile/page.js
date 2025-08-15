"use client";

import React from "react";
import { MapPin, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import OrderCarousel from "@/components/OrderCarousel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";

const ProfileField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    <p className="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
      {value || "Not set"}
    </p>
  </div>
);

export default function Profile() {
  const router = useRouter();
  const { profile, isLoading, error } = useUserProfile();
  const { user, isLoading: authLoading } = useAuth();

  if (isLoading || authLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const address = profile?.address || {};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <User className="text-gray-500" /> Personal Information
              </h2>
              <div className="space-y-4">
                <ProfileField label="Name" value={profile?.name} />
                <ProfileField label="Email" value={profile?.email} />
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Change Password
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <MapPin className="text-gray-500" /> Address
              </h2>
              <div className="space-y-4">
                <ProfileField label="Street" value={address.street} />
                <ProfileField label="City" value={address.city} />
                <ProfileField label="State" value={address.state} />
                <ProfileField label="Postal Code" value={address.postalCode} />
                <ProfileField label="Country" value={address.country} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Orders
            </h2>
            <OrderCarousel />
          </motion.div>
        </div>
      </div>
    </>
  );
}
