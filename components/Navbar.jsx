"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Package,
  Heart,
  Tag,
  Settings,
  HelpCircle,
  IndianRupee,
  LayoutGrid,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import "@/app/_styles/global.css";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import NavigationLoader from "./NavigationLoader";

export default function Navbar({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const { data: session } = useSession();

  const { cartItems } = useCart();
  const cartItemLength = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  React.useEffect(() => {
    if (
      user?.role === "admin" ||
      user?.email === "dvbeast465@gmail.com" ||
      user?.email === "divyanshumishra2004@gmail.com"
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const router = useRouter();

  const handleUserIconClick = () => {
    if (!session) {
      console.log(pushing);

      router.push("/api/auth/signin");
    } else {
      if (window.innerWidth > 767) {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else {
          setIsDropdownOpen(true);
          setMobileMenuOpen(false);
        }
      } else {
        router.push("/profile");
      }
    }
  };
  const [isPending, startTransition] = React.useTransition();
  const [query, setQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
    setQuery("");
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    if (user)
      startTransition(() => {
        router.push("/profile/carts");
      });
    else
      startTransition(() => {
        router.push("/api/auth/signin");
      });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      if (currentScrollY > 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleNavigation = React.useCallback(
    (path) => {
      setIsNavigating(true);
      startTransition(() => {
        router.push(path)?.finally(() => {
          setIsNavigating(false);
        });
      });
    },
    [router]
  );

  const handleProClick = (path) => {
    setIsDropdownOpen(false);
    setMobileMenuOpen(false);
    handleNavigation(path);
  };

  return (
    <>
      {isNavigating && <NavigationLoader />}
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black bg-opacity-90 backdrop-blur-lg shadow-lg"
            : "bg-black"
        }`}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
        }}
        whileHover={{ backdropFilter: "blur(10px)" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <AnimatePresence>
            {!isSearchFocused && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isSearchFocused ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-row gap-5 items-center"
              >
                <Link
                  href="/"
                  className="text-2xl font-bold text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Elysoria
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`relative transition-all duration-300 ${
              isSearchFocused ? "w-full" : "w-full max-w-[400px]"
            }`}
            style={{
              width: isSearchFocused ? "100%" : "100%",
              maxWidth: isSearchFocused ? "100%" : "400px",
            }}
          >
            <form onSubmit={handleSearch} className="w-full flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black text-gray-200 placeholder-gray-400 transition-all duration-200"
                style={{
                  background: "transparent",
                  border: isSearchFocused
                    ? "linear-gradient(45deg, #ff0080, #7928ca, #ff0080)"
                    : "2px solid transparent",
                  backgroundImage: "none",
                  backgroundClip: "padding-box",
                  boxShadow: isSearchFocused
                    ? "0 0 10px rgba(255, 0, 128, 0.5), 0 0 20px rgba(121, 40, 202, 0.5)"
                    : "none",
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors duration-200"
                style={{
                  background: isSearchFocused
                    ? "linear-gradient(45deg, #ff0080, #7928ca)"
                    : "none",
                  WebkitBackgroundClip: isSearchFocused ? "text" : "none",
                  WebkitTextFillColor: isSearchFocused
                    ? "transparent"
                    : "inherit",
                }}
              >
                <Search size={18} />
              </button>
              {isPending && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <Spinner size="md" />
                </div>
              )}
            </form>
          </div>

          <AnimatePresence>
            {!isSearchFocused && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isSearchFocused ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-4"
              >
                <div className="relative user-dropdown hidden md:block">
                  <button
                    onClick={handleUserIconClick}
                    className="text-gray-200 hover:text-white focus:outline-none transition-colors duration-200"
                  >
                    <User className="w-6 h-6" />
                  </button>

                  {isDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.ul
                        className="py-2"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              delayChildren: 0.2,
                              staggerChildren: 0.05,
                            },
                          },
                          exit: {
                            opacity: 0,

                            transition: {
                              staggerChildren: 0.05,
                              staggerDirection: -1,
                            },
                          },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                          }}
                        >
                          {isPending && (
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                              <Spinner size="md" />
                            </div>
                          )}
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              handleProClick("/profile");
                            }}
                            className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 hover:cursor-pointer"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </div>
                        </motion.li>
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                          }}
                        >
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              handleProClick("/profile/carts");
                            }}
                            className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Cart
                          </div>
                        </motion.li>
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                          }}
                        >
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              handleProClick("/profile/orders");
                            }}
                            className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Orders
                          </div>
                        </motion.li>
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                          }}
                        >
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              handleProClick("/profile/wishlist");
                            }}
                            className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Wishlist
                          </div>
                        </motion.li>
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                          }}
                        ></motion.li>
                        <motion.li
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 },
                          }}
                        >
                          <div
                            onClick={() => {
                              handleProClick("/profile/settings");
                            }}
                            className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </div>
                        </motion.li>
                      </motion.ul>
                    </motion.div>
                  )}
                </div>

                <div className="relative hidden md:block">
                  <button
                    onClick={(e) => handleCartClick(e)}
                    className="text-gray-200 hover:text-white focus:outline-none transition-colors duration-200 relative"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemLength > 0 && (
                      <span
                        className="
          absolute
          -top-2
          -right-2
          bg-white
          text-black
          text-xs
          rounded-full
          px-1.5
          py-0.5
          font-semibold
        "
                      >
                        {cartItemLength}
                      </span>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    className="text-gray-200 hover:text-white transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="bg-black bg-opacity-90 backdrop-blur-lg shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.ul
                className="py-2"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.2,
                      staggerChildren: 0.05,
                    },
                  },
                  exit: {
                    opacity: 0,
                    transition: {
                      staggerChildren: 0,
                      staggerDirection: 0,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {isAdmin && (
                  <motion.li
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: 0 },
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        handleProClick("/admin");
                      }}
                      className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </div>
                  </motion.li>
                )}

                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 0 },
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      handleProClick("/categories");
                    }}
                    className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Categories
                  </div>
                </motion.li>
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 0 },
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      handleProClick("/coupons");
                    }}
                    className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Coupons
                  </div>
                </motion.li>
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 0 },
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      handleProClick("/sell");
                    }}
                    className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Sell
                  </div>
                </motion.li>
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 0 },
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      handleProClick("/help");
                    }}
                    className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </div>
                </motion.li>
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 0 },
                  }}
                >
                  <div
                    className="hover:cursor-pointer flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProClick("/profile/settings");
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </div>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
