"use client";
import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Settings,
  ShoppingBasket,
  House,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (href) => pathname === href;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleTap = () => {
    setVisible(true);
  };

  return (
    <>
      {!visible && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleTap}
          aria-label="Tap to Show Navigation"
        />
      )}

      <motion.div
        className={`fixed bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-lg border-t border-gray-700 shadow-xl z-50 md:hidden`}
        initial={{ y: 100 }}
        animate={{ y: visible ? 0 : 100 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div className="flex justify-around items-center p-3">
          {[
            { href: "/", icon: House, label: "Home" },
            { href: "/profile/orders", icon: ShoppingBasket, label: "Orders" },
            { href: "/profile/carts", icon: ShoppingCart, label: "Cart" },
            { href: "/profile/wishlist", icon: Heart, label: "Wishlist" },
            { href: "/profile/settings", icon: Settings, label: "Settings" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="relative flex flex-col items-center group"
            >
              <motion.div
                className={`flex flex-col items-center ${
                  isActive(item.href) ? "text-white" : "text-gray-400"
                } hover:text-white transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon
                  className="w-6 h-6 mb-1 stroke-[1.5]"
                  stroke={isActive(item.href) ? "currentColor" : "currentColor"}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>

              {isActive(item.href) && (
                <motion.div
                  className="absolute -top-2 w-1 h-1 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              )}
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default BottomNavigation;
