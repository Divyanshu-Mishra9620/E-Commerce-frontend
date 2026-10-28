"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  LayoutGrid,
  Tag,
  IndianRupee,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { useAuth } from "@/hooks/useAuth";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/coupons", label: "Coupons", icon: Tag },
  { href: "/sell", label: "Sell", icon: IndianRupee },
  { href: "/admin", label: "Admin", icon: Settings, adminOnly: true },
];

export function BrandMark({ className }) {
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
      aria-label="Elysoria home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-brand-gradient text-[#fff] shadow-lg shadow-brand-600/30">
        <span className="font-display text-lg font-extrabold leading-none">E</span>
        <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.5)_50%,transparent_70%)] transition-transform duration-700 ease-out-expo group-hover:translate-x-full" />
      </span>
      <span className="hidden font-display text-xl font-extrabold tracking-[-0.04em] text-slate-950 sm:block">
        Elysoria<span className="text-coral-500">.</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [hoveredLink, setHoveredLink] = React.useState(null);

  const pathname = usePathname();
  const { isScrolled, isVisible } = useScrollHandler();
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();

  const visibleNavLinks = React.useMemo(
    () => navLinks.filter((link) => !link.adminOnly || isAdmin),
    [isAdmin]
  );

  React.useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const showCartCount = isAuthenticated && cartCount > 0;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 pt-3"
        animate={{ y: isVisible ? 0 : "-130%" }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        <div className="storefront-section">
          <nav
            className={cn(
              "flex items-center justify-between gap-3 rounded-full border py-2 pl-3 pr-2 transition-all duration-500 ease-out-expo sm:pl-4",
              isScrolled
                ? "border-slate-200 bg-white/85 shadow-[0_20px_50px_-30px_rgba(35,18,79,0.5)] backdrop-blur-xl"
                : "border-transparent bg-white/70 backdrop-blur-md"
            )}
          >
            <div className="flex items-center gap-4 lg:gap-6">
              <BrandMark />

              <div
                className="hidden items-center lg:flex"
                onMouseLeave={() => setHoveredLink(null)}
              >
                {visibleNavLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                        isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-950"
                      )}
                    >
                      {hoveredLink === link.href && (
                        <motion.span
                          layoutId="nav-hover-pill"
                          className="absolute inset-0 rounded-full bg-slate-900/[0.06] dark:bg-white/[0.08]"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-coral-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[min(46vw,18rem)] sm:w-[18rem] lg:w-[20rem]">
                <SearchBar />
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <UserMenu />

                <Link
                  href="/profile/carts"
                  className="icon-btn relative"
                  aria-label={showCartCount ? `Cart, ${cartCount} items` : "Cart"}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <AnimatePresence>
                    {showCartCount && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 18 }}
                        className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-coral-500 px-1.5 text-[10px] font-bold text-[#fff] shadow-lg shadow-coral-500/40"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="icon-btn lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            onClose={() => setMobileMenuOpen(false)}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>
    </>
  );
}
