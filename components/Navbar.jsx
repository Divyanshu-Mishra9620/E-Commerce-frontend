"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search, User, ChevronDown, ChevronUp } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import "@/app/_styles/global.css";

const categories = [
  // ... (your categories array remains the same)
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] =
    React.useState(false);

  const { data: session } = useSession();

  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const handleUserIconClick = () => {
    if (!session) {
      router.push("/api/auth/signin");
    } else {
      router.push("/profile");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    setQuery("");
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-blue-100 bg-opacity-90 backdrop-blur-lg shadow-md"
          : "bg-blue-100"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex flex-row gap-5 items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            ShopEase
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <button
                className="flex items-center text-gray-800 hover:text-gray-900"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                Categories
                {isCategoriesOpen ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </button>
              {isCategoriesOpen && (
                <div className="fixed left-0 top-[60px] w-full bg-white shadow-lg z-40">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-4 gap-6">
                      {categories.map((category) => (
                        <div key={category.title} className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {category.title}
                          </h3>
                          <ul className="space-y-1">
                            {category.subCategories.map((subCategory) => (
                              <li key={subCategory.title}>
                                <Link
                                  href={subCategory.href}
                                  className="text-gray-600 hover:text-gray-900"
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  {subCategory.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/deals" className="text-gray-800 hover:text-gray-900">
              Deals
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-gray-900">
              Contact Us
            </Link>
          </div>
        </div>

        <div
          className={`${
            searchOpen ? "flex" : "hidden"
          } md:flex relative w-full max-w-[400px] mx-4`}
        >
          <form onSubmit={handleSearch} className="w-full flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="absolute right-3 top-2.5">
              <Search className="text-gray-400" size={18} />
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMobileMenuOpen(false);
            }}
          >
            <Search className="w-6 h-6" />
          </button>

          <div className="relative">
            <button
              onClick={handleUserIconClick}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <User className="w-6 h-6" />
            </button>
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setSearchOpen(false);
            }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md mt-2 absolute w-full left-0">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <button
                className="flex items-center justify-between w-full p-2 hover:bg-gray-100"
                onClick={() =>
                  setIsMobileCategoriesOpen(!isMobileCategoriesOpen)
                }
              >
                <span>Categories</span>
                {isMobileCategoriesOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {isMobileCategoriesOpen && (
                <ul className="pl-4 mt-2 space-y-2 z-20 max-h-[300px] overflow-y-auto">
                  {categories.map((category) => (
                    <li key={category.title}>
                      <Link
                        href={category.href}
                        className="block p-2 hover:bg-gray-100"
                        onClick={() => {
                          setIsMobileCategoriesOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {category.title}
                      </Link>
                      <ul className="pl-4 mt-1 space-y-1">
                        {category.subCategories.map((subCategory) => (
                          <li key={subCategory.title}>
                            <Link
                              href={subCategory.href}
                              className="block p-2 hover:bg-gray-100"
                              onClick={() => {
                                setIsMobileCategoriesOpen(false);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {subCategory.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/deals"
                className="block p-2 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block p-2 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
