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
          isScrolled ? "bg-black/80 backdrop-blur-lg" : "bg-black"
        }`}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="relative h-12 w-32 block"
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

            <div className="hidden lg:flex items-center gap-6">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <SearchBar />
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <UserMenu />

              <Link
                href="/profile/carts"
                className="relative text-gray-200 hover:text-white"
              >
                <ShoppingCart className="w-6 h-6" />
                {isAuthenticated && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1.5 py-0.5 font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-200"
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileMenu onClose={() => setMobileMenuOpen(false)} isAdmin={isAdmin} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
