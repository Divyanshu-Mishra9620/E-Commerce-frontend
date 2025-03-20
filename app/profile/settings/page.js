"use client";
import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import {
  User,
  Lock,
  Bell,
  MapPin,
  Globe,
  LogOut,
  Menu,
  MoveLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { signOut } from "next-auth/react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const Settings = () => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [security, setSecurity] = useState({
    twoFactorAuth: true,
  });
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
    currency: "USD",
  });

  const router = useRouter();
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch(`${BACKEND_URI}/api/users/email/${user.email}`);
      if (!res.ok) throw new Error("No user exists", res.message);
      const data = await res.json();
      setAddress(data.address);
    };
    if (isAddressUpdated) fetchUserData();
  }, [isAddressUpdated, user.email]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (window.scrollY > 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (scrollY + windowHeight < fullHeight - 50) {
        setIsBottomNavVisible(true);
      } else {
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setIsBottomNavVisible(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsBottomNavVisible(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5001/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        state: address.state,
        country: address.country,
      }),
    });
    setIsAddressUpdated(false);
    const data = await res.json();
    console.log("address res", data);

    closeModal();
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-90 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-700">
              <MoveLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className="text-gray-700"
            >
              <User className="w-6 h-6" />
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 min-h-screen pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6" /> Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      readOnly
                      checked={security.twoFactorAuth}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                {/* <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => router.push("/api/auth/signin/reset-password")}
                >
                  Change Password
                </button> */}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6" /> Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="email"
                      checked={notifications.email}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="push"
                      checked={notifications.push}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" /> Address Book
              </h2>
              <div className="space-y-4">
                <div
                  key={Math.random() * 100 + 1}
                  className="p-4 border border-gray-100 rounded-lg bg-gray-50"
                >
                  <p className="text-sm text-gray-500">
                    {address?.street}, {address?.city}, {address?.state}{" "}
                    {address?.postalCode}, {address?.country}
                  </p>
                  <button
                    onClick={openModal}
                    className="text-blue-500 hover:text-blue-700 mt-2"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Edit Address</h3>
                    <form onSubmit={handleSaveAddress}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Street
                          </label>
                          <input
                            type="text"
                            value={address.street}
                            onChange={(e) =>
                              setAddress({ ...address, street: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            value={address.city}
                            onChange={(e) =>
                              setAddress({ ...address, city: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            value={address.state}
                            onChange={(e) =>
                              setAddress({ ...address, state: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={address.postalCode}
                            onChange={(e) =>
                              setAddress({
                                ...address,
                                postalCode: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            type="text"
                            value={address.country}
                            onChange={(e) =>
                              setAddress({
                                ...address,
                                country: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6" /> Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={preferences.language}
                    onChange={handlePreferenceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={preferences.currency}
                    onChange={handlePreferenceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation visible={isBottomNavVisible} />
    </>
  );
};

export default withAuth(Settings);
