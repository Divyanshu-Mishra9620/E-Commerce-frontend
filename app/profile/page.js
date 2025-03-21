"use client";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import OrderCarousel from "@/components/OrderCarousel";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import ProfileSidebar from "@/components/ProfileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import "@/app/_styles/global.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function Profile() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasFetchedAddress, setHasFetchedAddress] = React.useState(false);
  const [address, setAddress] = React.useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [user, setUser] = React.useState(null);
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/api/auth/signin");
      }
    }
  }, []);

  React.useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URI}/api/users/email/${user.email}`
        );
        const data = await response.json();

        if (data.address) {
          setAddress(data.address);
          setHasFetchedAddress(true);
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email && !hasFetchedAddress) {
      fetchUserAddress();
    }
  }, [user, hasFetchedAddress]);

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-90 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ShopEase
          </Link>
        </div>
      </nav>

      <ProfileSidebar />

      <div className="mt-16 md:ml-64">
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  disabled
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  placeholder="Your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    disabled
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    disabled
                    placeholder="Enter city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    disabled
                    placeholder="Enter state"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    disabled
                    placeholder="Enter country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    disabled
                    value={address.postalCode}
                    placeholder="Enter postal code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-12 mt-6">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Orders
              </h2>
              <OrderCarousel />
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation visible={isBottomNavVisible} />

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
