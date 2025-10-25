"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Lock, User, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "E-Commerce Store",
    storeEmail: "admin@ecommerce.com",
    storePhone: "+91-1234567890",
    currency: "INR",
    notifications: {
      emailOnNewOrder: true,
      emailOnNewReview: true,
      emailOnLowStock: true,
      smsNotifications: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: "Store Information",
      icon: User,
      fields: [
        { label: "Store Name", key: "storeName", type: "text" },
        { label: "Store Email", key: "storeEmail", type: "email" },
        { label: "Store Phone", key: "storePhone", type: "tel" },
        {
          label: "Currency",
          key: "currency",
          type: "select",
          options: ["INR", "USD", "EUR"],
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      type: "checkboxes",
      fields: [
        { label: "Email on New Order", key: "emailOnNewOrder" },
        { label: "Email on New Review", key: "emailOnNewReview" },
        { label: "Email on Low Stock", key: "emailOnLowStock" },
        { label: "SMS Notifications", key: "smsNotifications" },
      ],
    },
    {
      title: "Security",
      icon: Lock,
      type: "security",
      fields: [{ label: "Two-Factor Authentication", key: "twoFactorAuth" }],
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Admin Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your store configuration and preferences
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Store Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  handleSettingChange("storeName", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Store Email
              </label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) =>
                  handleSettingChange("storeEmail", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Store Phone
              </label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) =>
                  handleSettingChange("storePhone", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  handleSettingChange("currency", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    handleNotificationChange(key, e.target.checked)
                  }
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
                />
                <span className="text-slate-900 font-medium">
                  {key === "emailOnNewOrder" && "Email on New Order"}
                  {key === "emailOnNewReview" && "Email on New Review"}
                  {key === "emailOnLowStock" && "Email on Low Stock"}
                  {key === "smsNotifications" && "SMS Notifications"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Security</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-slate-600">
                  Enhance your account security
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) =>
                  handleSecurityChange("twoFactorAuth", e.target.checked)
                }
                className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </label>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleSecurityChange(
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
                min="5"
                max="120"
                className="w-full md:w-32 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-600 mt-1">
                Automatically log out after this period of inactivity
              </p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Settings"}
        </motion.button>
      </motion.div>
    </div>
  );
}
