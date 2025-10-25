"use client";
import React, { useState } from "react";
import {
  Lock,
  MapPin,
  LogOut,
  Bell,
  Shield,
  Trash2,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "react-hot-toast";
import { authedFetch } from "@/utils/authedFetch";
import withAuth from "@/components/withAuth";
import { useModal } from "@/hooks/useModal";

const SettingsCard = ({ icon: Icon, title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white"
  >
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2.5 bg-blue-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
    </div>
    <div className="border-t border-slate-200 pt-4 space-y-4">{children}</div>
  </motion.div>
);

const Modal = ({ isOpen, title, children, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AddressForm = ({ initialAddress, onSave, onCancel, isNew = false }) => {
  const [address, setAddress] = useState(
    initialAddress || {
      fullName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
      isDefault: false,
    }
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(address);
    setIsSaving(false);
  };

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "street", label: "Street Address", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "state", label: "State/Province", type: "text", required: true },
    { name: "postalCode", label: "Postal Code", type: "text", required: true },
    { name: "country", label: "Country", type: "text", required: true },
    { name: "phoneNumber", label: "Phone Number", type: "tel", required: true },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={address[field.name]}
            onChange={handleChange}
            required={field.required}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
          />
        </div>
      ))}

      <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
        <input
          type="checkbox"
          name="isDefault"
          checked={address.isDefault}
          onChange={handleChange}
          className="w-4 h-4 rounded border-slate-300 text-blue-600"
        />
        <span className="text-sm font-medium text-slate-900">
          Set as default address
        </span>
      </label>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : isNew ? "Add Address" : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

const PasswordForm = ({ onSave, onCancel }) => {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (password.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSaving(true);
    await onSave(password);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        {
          name: "currentPassword",
          label: "Current Password",
          key: "current",
        },
        { name: "newPassword", label: "New Password", key: "new" },
        { name: "confirmPassword", label: "Confirm Password", key: "confirm" },
      ].map(({ name, label, key }) => (
        <div key={name}>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {label}
          </label>
          <div className="relative">
            <input
              type={showPasswords[key] ? "text" : "password"}
              name={name}
              value={password[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPasswords[key] ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

function Settings() {
  const { profile, isLoading, error, mutate } = useUserProfile();

  const [modalState, setModalState] = useState({
    editAddress: false,
    newAddress: false,
    changePassword: false,
    deleteAccount: false,
  });
  const [selectedAddress, setSelectedAddress] = useState(null);

  const initialAddresses =
    profile?.addresses?.length > 0
      ? profile.addresses
      : profile?.address
      ? [{ ...profile.address, _id: "default", isDefault: true }]
      : [];

  const [addresses, setAddresses] = useState(initialAddresses);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    productRecommendations: true,
  });

  const openModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  const handleSaveAddress = async (address) => {
    try {
      let updatePayload = {};

      if (selectedAddress) {
        const newAddresses = addresses.map((a) =>
          a._id === selectedAddress._id ? address : a
        );
        updatePayload = { addresses: newAddresses };
        setAddresses(newAddresses);
      } else {
        const newAddresses = [
          ...(addresses || []),
          { ...address, _id: Date.now().toString() },
        ];
        updatePayload = { addresses: newAddresses };
        setAddresses(newAddresses);
      }

      await authedFetch(`/api/users/${profile._id}`, {
        method: "PUT",
        body: updatePayload,
      });

      toast.success(
        selectedAddress ? "Address updated!" : "Address added successfully!"
      );
      closeModal(selectedAddress ? "editAddress" : "newAddress");
      setSelectedAddress(null);
      mutate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const newAddresses = addresses.filter((a) => a._id !== addressId);
      await authedFetch(`/api/users/${profile._id}`, {
        method: "PUT",
        body: { addresses: newAddresses },
      });

      setAddresses(newAddresses);
      toast.success("Address deleted!");
      mutate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await authedFetch("/api/users/change-password", {
        method: "POST",
        body: passwordData,
      });

      toast.success("Password changed successfully!");
      closeModal("changePassword");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Notification preferences updated!");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/api/auth/signin" });
  };

  const handleDeleteAccount = async () => {
    try {
      await authedFetch(`/api/users/${profile._id}`, {
        method: "DELETE",
      });

      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">
              Manage your account preferences and security
            </p>
          </motion.div>

          <SettingsCard
            icon={Shield}
            title="Profile Information"
            description="View and manage your personal information"
          >
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Full Name
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {profile?.name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Email
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {profile?.email}
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-200" />
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Phone
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {profile?.phoneNumber || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    Member Since
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {new Date(profile?.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={MapPin}
            title="Address Book"
            description="Manage your shipping and billing addresses"
          >
            {addresses && addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address, idx) => (
                  <div key={address._id}>
                    <div className="flex items-start justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {address.fullName}
                          </h3>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mt-1">
                          {address.street}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {address.country}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {address.phoneNumber}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAddress(address);
                            openModal("editAddress");
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {idx < addresses.length - 1 && (
                      <div className="border-b border-slate-200" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">No addresses added yet</p>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedAddress(null);
                openModal("newAddress");
              }}
              className="mt-4 px-4 py-2.5 text-blue-600 font-semibold transition-colors flex items-center gap-2 w-full justify-center border-t border-slate-200 pt-4"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </SettingsCard>

          <SettingsCard
            icon={Bell}
            title="Notification Preferences"
            description="Control how we communicate with you"
          >
            <div className="space-y-3">
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  desc: "Receive email updates about your account",
                },
                {
                  key: "orderUpdates",
                  label: "Order Updates",
                  desc: "Get notified about your order status",
                },
                {
                  key: "promotions",
                  label: "Promotional Emails",
                  desc: "Receive special offers and discounts",
                },
                {
                  key: "productRecommendations",
                  label: "Product Recommendations",
                  desc: "Personalized product suggestions",
                },
              ].map(({ key, label, desc }, idx, arr) => (
                <div key={key}>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className="w-full py-4 transition-colors flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="font-semibold text-slate-900">{label}</p>
                      <p className="text-sm text-slate-600">{desc}</p>
                    </div>
                    <div
                      className={`w-12 h-7 rounded-full transition-colors flex items-center ${
                        notificationSettings[key]
                          ? "bg-green-500"
                          : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white transition-transform ${
                          notificationSettings[key] ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {idx < arr.length - 1 && (
                    <div className="border-b border-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            icon={Lock}
            title="Security"
            description="Protect your account with strong security measures"
          >
            <div className="space-y-0">
              <button
                onClick={() => openModal("changePassword")}
                className="w-full py-4 transition-colors flex items-center justify-between text-left hover:text-blue-600"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    Change Password
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Update your password regularly
                  </p>
                </div>
                <Edit3 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={LogOut}
            title="Account Actions"
            description="Manage your account access and deletion"
          >
            <div className="space-y-0">
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 text-orange-600 font-semibold transition-colors flex items-center justify-between text-left hover:text-orange-700 border-b border-slate-200 pb-4"
              >
                <span>Log Out</span>
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => openModal("deleteAccount")}
                className="w-full px-6 py-3 text-red-600 font-semibold transition-colors flex items-center justify-between text-left hover:text-red-700 pt-4"
              >
                <span>Delete Account</span>
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>

      <Modal
        isOpen={modalState.editAddress}
        title="Edit Address"
        onClose={() => closeModal("editAddress")}
      >
        <AddressForm
          initialAddress={selectedAddress}
          onSave={handleSaveAddress}
          onCancel={() => closeModal("editAddress")}
        />
      </Modal>

      <Modal
        isOpen={modalState.newAddress}
        title="Add New Address"
        onClose={() => closeModal("newAddress")}
      >
        <AddressForm
          initialAddress={null}
          onSave={handleSaveAddress}
          onCancel={() => closeModal("newAddress")}
          isNew={true}
        />
      </Modal>

      <Modal
        isOpen={modalState.changePassword}
        title="Change Password"
        onClose={() => closeModal("changePassword")}
      >
        <PasswordForm
          onSave={handleChangePassword}
          onCancel={() => closeModal("changePassword")}
        />
      </Modal>

      <Modal
        isOpen={modalState.deleteAccount}
        title="Delete Account"
        onClose={() => closeModal("deleteAccount")}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Deleting your account is permanent and
              cannot be undone. All your data will be deleted.
            </p>
          </div>
          <p className="text-slate-600">
            Are you sure you want to delete your account? This action cannot be
            reversed.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => closeModal("deleteAccount")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default withAuth(Settings);
