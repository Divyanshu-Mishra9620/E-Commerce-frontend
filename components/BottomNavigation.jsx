"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { mainNavItems } from "@/config/navItems";
import { cn } from "@/lib/utils";

const NavItem = ({ href, icon: Icon, label, isActive, badgeCount }) => (
  <Link
    href={href}
    aria-current={isActive ? "page" : undefined}
    className="relative flex min-w-0 flex-1 flex-col items-center rounded-2xl px-2 py-2.5"
  >
    {isActive && (
      <motion.span
        layoutId="bottom-nav-indicator"
        className="absolute inset-0 rounded-2xl bg-[#0f0d1f] shadow-lg shadow-brand-900/25 dark:bg-[#f0eeff]"
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      />
    )}
    <Icon
      className={cn(
        "relative mb-1 h-5 w-5 transition-colors duration-300",
        isActive ? "text-coral-400 dark:text-coral-500" : "text-slate-500"
      )}
      strokeWidth={isActive ? 2.2 : 1.75}
    />
    <span
      className={cn(
        "relative text-[11px] font-semibold transition-colors duration-300",
        isActive ? "text-[#fff] dark:text-[#0f0d1f]" : "text-slate-500"
      )}
    >
      {label}
    </span>
    <AnimatePresence>
      {badgeCount > 0 && (
        <motion.span
          key={badgeCount}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute right-1 top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-[#fff] shadow-lg shadow-coral-500/40"
        >
          {badgeCount}
        </motion.span>
      )}
    </AnimatePresence>
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
    <motion.nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden"
      animate={{ y: isVisible ? 0 : 120 }}
      transition={{ type: "spring", damping: 22, stiffness: 220 }}
    >
      <div className="storefront-panel-soft mx-auto flex max-w-md items-center gap-1 rounded-[1.4rem] p-1.5">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
            badgeCount={getBadgeCount(item.badge)}
          />
        ))}
      </div>
    </motion.nav>
  );
}
