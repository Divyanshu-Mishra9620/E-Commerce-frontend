"use client";

import React, { useEffect } from "react";
import { MapPin, User, Edit3, LogOut, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import OrderCarousel from "@/components/OrderCarousel";
import { useUserProfile } from "@/hooks/useUserProfile";
import toast from "react-hot-toast";

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-slate-50 transition-all duration-200">
    {Icon && <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />}
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <p className="mt-1.5 text-slate-900 font-medium truncate">
        {value || <span className="text-slate-500 italic">Not set</span>}
      </p>
    </div>
  </div>
);

export default function Profile() {
  const router = useRouter();
  const { profile, isLoading, error } = useUserProfile();
  useEffect(() => {
    if (!isLoading && !profile) {
      signOut({ callbackUrl: "/api/auth/signin" });
    }
  }, [isLoading, profile]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!profile) {
    return <PageLoader />;
  }

  const address = profile?.address || {};

  const handleLogout = async () => {
    toast.success("Logging out...");
    await signOut({ callbackUrl: "/api/auth/signin" });
  };

  const handleEditProfile = () => {
    router.push("/profile/settings");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-slate-900 w-full mt-12">
        <div className="w-full px-0 sm:px-0 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-slate-50 rounded-lg shadow-sm">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Welcome, {profile?.name}
                </h1>
                <p className="text-slate-600 text-base">
                  Manage your profile, orders, and preferences
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          <div className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Personal Information
                  </h2>
                </div>
                <div className="space-y-3">
                  <ProfileField
                    label="Full Name"
                    value={profile?.name}
                    icon={User}
                  />
                  <ProfileField label="Email Address" value={profile?.email} />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/forgot-password")}
                    className="mt-4 w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-all duration-200"
                  >
                    Change Password
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Address Information
                  </h2>
                </div>
                <div className="space-y-3">
                  <ProfileField
                    label="Street Address"
                    value={address.street}
                    icon={MapPin}
                  />
                  <ProfileField label="City" value={address.city} />
                  <ProfileField label="State/Province" value={address.state} />
                  <ProfileField
                    label="Postal Code"
                    value={address.postalCode}
                  />
                  <ProfileField label="Country" value={address.country} />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditProfile}
                    className="mt-4 w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-all duration-200"
                  >
                    Update Address
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4 sm:px-6 lg:px-8 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Award,
                  label: "Member Since",
                  value: new Date(profile?.createdAt).toLocaleDateString(),
                },
                {
                  icon: Calendar,
                  label: "Account Status",
                  value: "Active",
                },
                {
                  icon: User,
                  label: "Account Type",
                  value: "Premium",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ translateY: -2 }}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2 rounded-lg mb-3 w-fit bg-slate-100">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-medium uppercase tracking-wide mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-4 sm:px-6 lg:px-8 mb-8"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Your Orders
                </h2>
              </div>
              <OrderCarousel />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-4 sm:px-6 lg:px-8 mb-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
