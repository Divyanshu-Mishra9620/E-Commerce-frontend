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
    className={`relative flex min-w-0 flex-1 flex-col items-center rounded-2xl px-2 py-2.5 transition-all duration-200 ${
      isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-500"
    }`}
  >
    <Icon
      className={`mb-1 h-5 w-5 transition-colors ${
        isActive ? "text-white" : "text-slate-500"
      }`}
      strokeWidth={isActive ? 2 : 1.75}
    />
    <span className="text-[11px] font-medium">{label}</span>
    {badgeCount > 0 && (
      <div className="absolute right-1 top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/30">
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
      className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden"
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <div className="storefront-panel-soft mx-auto flex max-w-md items-center gap-2 px-2 py-2">
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
