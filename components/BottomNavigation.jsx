"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { mainNavItems } from "@/config/navItems";

const NavItem = ({ href, icon: Icon, label, isActive, badgeCount }) => (
  <Link
    href={href}
    className="relative flex flex-col items-center group px-1 py-2 w-16"
  >
    <div
      className={`flex flex-col items-center ${
        isActive ? "text-blue-600" : "text-gray-500"
      } group-hover:text-blue-600 transition-colors`}
    >
      <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2 : 1.5} />
      <span className="text-xs font-medium">{label}</span>
    </div>
    {badgeCount > 0 && (
      <div className="absolute top-0 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
        {badgeCount}
      </div>
    )}
  </Link>
);

export default function BottomNavigation() {
  const pathname = usePathname();
  const { isVisible } = useScrollHandler();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  const getBadgeCount = (badgeType) => {
    if (badgeType === "cart") return cartCount;
    if (badgeType === "wishlist") return wishlistItems.length;
    return 0;
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-t-lg z-50 md:hidden"
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <div className="flex justify-around items-center">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
            badgeCount={getBadgeCount(item.badge)}
          />
        ))}
      </div>
    </motion.div>
  );
}
