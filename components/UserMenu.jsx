"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingCart, Package, Heart, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const MenuItem = ({ icon: Icon, text, onClick }) => (
  <li
    onClick={onClick}
    className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer"
  >
    <Icon className="w-4 h-4 mr-2" />
    <span>{text}</span>
  </li>
);

export const UserMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const handleNavigation = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      router.push("/api/auth/signin");
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <button
        onClick={handleUserIconClick}
        className="text-gray-200 hover:text-white"
      >
        <User className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleUserIconClick}
        className="text-gray-200 hover:text-white"
      >
        <User className="w-6 h-6" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 py-2"
          >
            <MenuItem
              icon={User}
              text="Profile"
              onClick={() => handleNavigation("/profile")}
            />
            <MenuItem
              icon={ShoppingCart}
              text="Cart"
              onClick={() => handleNavigation("/profile/carts")}
            />
            <MenuItem
              icon={Package}
              text="Orders"
              onClick={() => handleNavigation("/profile/orders")}
            />
            <MenuItem
              icon={Heart}
              text="Wishlist"
              onClick={() => handleNavigation("/profile/wishlist")}
            />
            <MenuItem
              icon={Settings}
              text="Settings"
              onClick={() => handleNavigation("/profile/settings")}
            />
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
