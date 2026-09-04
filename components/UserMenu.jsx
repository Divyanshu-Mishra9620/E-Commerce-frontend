"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Heart,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const MenuItem = ({ icon: Icon, text, onClick, tone = "default" }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-200",
      tone === "danger"
        ? "text-rose-600 hover:bg-rose-50"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-stone-800/70 dark:hover:text-amber-100"
    )}
  >
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-2xl border",
        tone === "danger"
          ? "border-rose-100 bg-rose-50"
          : "border-slate-200 bg-white dark:border-stone-700 dark:bg-zinc-900"
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
    <span>{text}</span>
  </button>
);

export const UserMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, isLoading: authLoading, signOut, user } = useAuth();
  const router = useRouter();
  const menuRef = React.useRef(null);

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

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!isAuthenticated && !authLoading) {
    return (
      <button
        onClick={handleUserIconClick}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:hover:border-amber-500/30 dark:hover:text-amber-200"
      >
        <User className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleUserIconClick}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-1.5 pr-3 text-slate-700 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:hover:border-amber-500/30 dark:hover:text-amber-200"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-500 text-sm font-semibold text-white dark:bg-stone-200 dark:text-stone-950">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </span>
        <span className="hidden text-left xl:block">
          <span className="block text-xs font-medium text-slate-400">
            Account
          </span>
          <span className="block max-w-24 truncate text-sm font-semibold text-slate-900">
            {user?.name || "Profile"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="storefront-panel absolute right-0 mt-3 w-72 overflow-hidden p-3 z-50"
          >
            <div className="rounded-[1.25rem] bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-600 px-4 py-4 text-white dark:bg-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/80 dark:text-amber-100/80">
                Signed In
              </p>
              <p className="mt-2 text-base font-semibold">
                {user?.name || "Your account"}
              </p>
              <p className="truncate text-sm text-blue-100/80 dark:text-amber-50/80">{user?.email}</p>
            </div>

            <div className="mt-3 space-y-1.5">
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
              <MenuItem
                icon={LogOut}
                text="Logout"
                tone="danger"
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
