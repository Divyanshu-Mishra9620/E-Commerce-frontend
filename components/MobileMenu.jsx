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

const MobileMenuItem = ({ href, icon: Icon, text, onClick, badgeCount, danger = false }) => {
  const classes =
    "flex w-full items-center justify-between rounded-[1.35rem] px-4 py-3.5 text-left transition-all duration-200";

  const content = (
    <>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
            danger
              ? "border-rose-100 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={`text-sm font-medium ${
            danger ? "text-rose-600" : "text-slate-800"
          }`}
        >
          {text}
        </span>
      </div>
      {badgeCount > 0 && (
        <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 text-[10px] font-semibold text-white shadow-lg shadow-emerald-500/30">
          {badgeCount}
        </span>
      )}
    </>
  );

  if (href === "#") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${classes} ${
          danger ? "hover:bg-rose-50" : "hover:bg-slate-100"
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${classes} ${danger ? "hover:bg-rose-50" : "hover:bg-slate-100"}`}
    >
      {content}
    </Link>
  );
};

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
      className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-2xl dark:border-slate-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-500 text-base font-semibold text-white dark:bg-stone-200 dark:text-stone-950">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Signed In
                  </p>
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Navigation
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">Menu</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:text-slate-900"
            >
              <X size={24} />
            </button>
          </div>
        </header>
        <nav className="flex-grow space-y-6 overflow-y-auto px-4 py-5">
          {isAdmin &&
            <div className="space-y-2">
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Admin
              </p>
              {adminNavItems.map((item) => (
                <MobileMenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.label}
                  onClick={onClose}
                />
              ))}
            </div>}

          <div className="space-y-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Main
            </p>
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
          </div>

          {isAuthenticated && (
            <div className="space-y-2">
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Account
              </p>
              {profileNavItems.map((item) => (
                <MobileMenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.label}
                  onClick={onClose}
                />
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Extras
            </p>
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
          </div>

          <div className="space-y-2">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Session
            </p>
            {isAuthenticated ? (
              <MobileMenuItem
                icon={LogOut}
                text="Logout"
                href="#"
                danger={true}
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
          </div>
        </nav>
      </motion.div>
    </motion.div>
  );
};
