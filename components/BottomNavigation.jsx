"use client";
import React from "react";
import {
  ShoppingCart,
  Heart,
  Settings,
  ShoppingBasket,
  House,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavigation = ({ visible }) => {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-blue-100 shadow-lg z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center p-2">
        <Link
          href="/"
          className={`flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors ${
            isActive("/") ? "text-blue-600" : ""
          }`}
        >
          <House className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/profile/orders"
          className={`flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors ${
            isActive("/profile/orders") ? "text-blue-600" : ""
          }`}
        >
          <ShoppingBasket className="w-6 h-6" />
          <span className="text-xs">Orders</span>
        </Link>

        <Link
          href="/profile/carts"
          className={`flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors ${
            isActive("/profile/carts") ? "text-blue-600" : ""
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs">Cart</span>
        </Link>

        <Link
          href="/profile/wishlist"
          className={`flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors ${
            isActive("/profile/wishlist") ? "text-blue-600" : ""
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs">Wishlist</span>
        </Link>

        <Link
          href="/profile/settings"
          className={`flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors ${
            isActive("/profile/settings") ? "text-blue-600" : ""
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
