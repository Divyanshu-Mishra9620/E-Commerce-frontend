"use client";
import React, { useState } from "react";
import { Lock, MapPin, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "react-hot-toast";
import { authedFetch } from "@/utils/authedFetch";
import withAuth from "@/components/withAuth";
import { useModal } from "@/hooks/useModal";

const SettingsCard = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
  >
    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      <Icon className="w-6 h-6 text-blue-600" />
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const AddressForm = ({ initialAddress, onSave, onCancel }) => {
  const [address, setAddress] = useState(initialAddress);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(address)?.map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            name={key}
            value={address[key]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </form>
  );
};

function Settings() {
  const { profile, isLoading, error, mutate } = useUserProfile();
  console.log(profile);

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  const handleSaveAddress = async (newAddress) => {
    try {
      authedFetch(`/api/users/${profile._id}`, {
        method: "PUT",
        body: JSON.stringify(newAddress),
      });

      toast.success("Address updated successfully!");
      mutate();
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/api/auth/signin" });
  };

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>

          <SettingsCard icon={Lock} title="Security">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <span>Two-Factor Authentication</span>
              <span className="text-sm font-semibold text-green-600">
                Enabled
              </span>
            </div>
          </SettingsCard>

          <SettingsCard icon={MapPin} title="Address Book">
            <div className="p-4 bg-gray-50 rounded-lg border text-gray-700 space-y-1">
              <p>
                <strong>Street:</strong> {profile.address?.street || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {profile.address?.city || "N/A"}
              </p>
              <p>
                <strong>Postal Code:</strong>{" "}
                {profile.address?.postalCode || "N/A"}
              </p>
            </div>
            <button
              onClick={openModal}
              className="mt-4 text-blue-600 hover:underline font-medium"
            >
              Edit Address
            </button>
          </SettingsCard>

          <SettingsCard icon={LogOut} title="Account Actions">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 text-white font-medium rounded-xl bg-red-600 hover:bg-red-700 transition-all"
            >
              Log Out
            </button>
          </SettingsCard>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Edit Address
            </h2>
            <AddressForm
              initialAddress={
                profile.address || {
                  street: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "",
                }
              }
              onSave={handleSaveAddress}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default withAuth(Settings);
