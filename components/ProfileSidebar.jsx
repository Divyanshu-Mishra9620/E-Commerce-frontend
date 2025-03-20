"use client";
import React from "react";
import {
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaShoppingBag,
  FaHome,
} from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfileSidebar = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    router.push("/api/auth/signin");
  }

  const imageUrl = session.user.image || "";

  return (
    <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 mt-16">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile Picture" />
            ) : (
              <FaUser className="text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{session.user.name}</h3>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHome className="w-5 h-5 mr-3" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/api/profile/carts"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaShoppingCart className="w-5 h-5 mr-3" />
              <span>Cart</span>
            </Link>
          </li>
          <li>
            <Link
              href="/api/profile/orders"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaShoppingBag className="w-5 h-5 mr-3" />
              <span>Order Details</span>
            </Link>
          </li>
          <li>
            <Link
              href="/api/profile/wishlist"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHeart className="w-5 h-5 mr-3" />
              <span>Wishlist</span>
            </Link>
          </li>
          <li>
            <Link
              href="/api/profile/settings"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaCog className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
