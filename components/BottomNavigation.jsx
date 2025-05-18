"use client";
import React, { useEffect, useState, useRef, useTransition } from "react";
import {
  ShoppingCart,
  Heart,
  Settings,
  ShoppingBasket,
  House,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Spinner from "./Spinner";

const BottomNavigation = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);
  const isActive = (href) => pathname === href;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
      if (visible) setVisible(false);
    } else {
      if (!visible) setVisible(true);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  const handleClick = async (href) => {
    startTransition(() => {
      router.push(`${href}`);
    });
  };

  const navItems = [
    { href: "/", icon: House, label: "Home" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/profile/orders", icon: ShoppingBasket, label: "Orders" },
    { href: "/profile/carts", icon: ShoppingCart, label: "Cart" },
    { href: "/profile/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/profile/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-lg border-t border-gray-700 shadow-xl z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: visible ? 0 : 100 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div className="flex justify-around items-center p-2">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center group px-1 py-2"
              onClick={() => handleClick(item.href)}
            >
              <motion.div
                className={`flex flex-col items-center ${
                  isActive(item.href) ? "text-white" : "text-gray-400"
                } hover:text-white transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon
                  className="w-5 h-5 mb-1 stroke-[1.5]"
                  stroke={isActive(item.href) ? "currentColor" : "currentColor"}
                  fill={isActive(item.href) ? "currentColor" : "none"}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>

              {isActive(item.href) && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {isPending && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <Spinner size="md" />
        </div>
      )}
    </>
  );
};

export default BottomNavigation;
