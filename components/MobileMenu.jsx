"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { signOut } from "next-auth/react";
import { X, LogIn, LogOut, Settings } from "lucide-react";
import {
  mainNavItems,
  profileNavItems,
  extraNavItems,
  adminNavItems,
} from "@/config/navItems";

const MobileMenuItem = ({ href, icon: Icon, text, onClick, badgeCount }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center justify-between px-6 py-4 text-lg text-slate-900 hover:bg-blue-50 transition-colors"
  >
    <div className="flex items-center">
      <Icon className="w-6 h-6 mr-4 text-slate-600" />
      <span>{text}</span>
    </div>
    {badgeCount > 0 && (
      <span className="bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {badgeCount}
      </span>
    )}
  </Link>
);

export const MobileMenu = ({ onClose, isAdmin }) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  const handleSignOut = () => {
    onClose();
    signOut({ callbackUrl: "/" });
  };
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const getBadgeCount = (badgeType) => {
    if (badgeType === "cart") return cartCount;
    if (badgeType === "wishlist") return wishlistItems.length;
    return 0;
  };
  if (authLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200">
          {isAuthenticated && user ? (
            <div>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-slate-900">Menu</p>
          )}
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </header>
        <nav className="flex-grow overflow-y-auto">
          {isAdmin &&
            adminNavItems.map((item) => (
              <MobileMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.label}
                onClick={onClose}
              />
            ))}
          <hr className="my-2" />
          {mainNavItems.map((item) => (
            <MobileMenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.label}
              onClick={onClose}
              badgeCount={getBadgeCount(item.badge)}
            />
          ))}
          <hr className="my-2" />
          {isAuthenticated &&
            profileNavItems.map((item) => (
              <MobileMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.label}
                onClick={onClose}
              />
            ))}
          <hr className="my-2" />
          {extraNavItems.map((item) => (
            <MobileMenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.label}
              onClick={onClose}
            />
          ))}
          {isAdmin && (
            <MobileMenuItem
              icon={Settings}
              text="Admin"
              href="/admin"
              onClick={onClose}
            />
          )}
          <hr className="my-2" />
          {isAuthenticated ? (
            <MobileMenuItem
              icon={LogOut}
              text="Logout"
              href="#"
              onClick={handleSignOut}
            />
          ) : (
            <MobileMenuItem
              icon={LogIn}
              text="Login / Sign Up"
              href="/api/auth/signin"
              onClick={onClose}
            />
          )}
        </nav>
      </motion.div>
    </motion.div>
  );
};
