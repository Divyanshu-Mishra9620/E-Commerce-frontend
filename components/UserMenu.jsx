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
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
    )}
  >
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-2xl border",
        tone === "danger"
          ? "border-rose-100 bg-rose-50"
          : "border-slate-200 bg-white"
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
        className="icon-btn"
        aria-label="Sign in"
      >
        <User className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleUserIconClick}
        className="icon-btn w-auto gap-2 px-1.5 pr-3"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-[#fff]">
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
            <div className="rounded-[1.25rem] relative overflow-hidden bg-[#0b0a14] bg-[radial-gradient(circle_at_top_right,rgba(118,85,250,0.55),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(255,106,61,0.3),transparent_55%)] px-4 py-4 text-[#fff]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fff]/60">
                Signed In
              </p>
              <p className="mt-2 text-base font-semibold">
                {user?.name || "Your account"}
              </p>
              <p className="truncate text-sm text-[#fff]/60">{user?.email}</p>
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
