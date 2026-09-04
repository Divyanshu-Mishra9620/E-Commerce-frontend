"use client";
import * as React from "react";
import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  LayoutGrid,
  Tag,
  IndianRupee,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { useAuth } from "@/hooks/useAuth";

import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import Image from "next/image";

const navLinks = [
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/coupons", label: "Coupons", icon: Tag },
  { href: "/sell", label: "Sell", icon: IndianRupee },
  { href: "/admin", label: "Admin", icon: Settings, adminOnly: true },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

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

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/80 bg-white/88 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
            : "border-b border-slate-100/80 bg-white/72 backdrop-blur-lg"
        }`}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="storefront-section flex items-center justify-between py-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link
              href="/"
              className="relative block h-12 w-28 shrink-0 sm:w-32"
              aria-label="Go to Homepage"
            >
              <Image
                src="/images/Elysoria-logo.png"
                alt="Elysoria Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>

            <div className="hidden items-center gap-5 lg:flex">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-stone-800/80 dark:hover:text-amber-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-[min(42vw,18rem)] sm:w-[18rem] lg:w-[20rem]">
              <SearchBar />
            </div>

            <div className="hidden items-center space-x-3 md:flex">
              <UserMenu />

              <Link
                href="/profile/carts"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:hover:border-amber-500/30 dark:hover:text-amber-200"
              >
                <ShoppingCart className="w-6 h-6" />
                {isAuthenticated && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-semibold text-white shadow-lg shadow-emerald-500/30">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:hover:border-amber-500/30 dark:hover:text-amber-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileMenu
              onClose={() => setMobileMenuOpen(false)}
              isAdmin={isAdmin}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
