/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState, Suspense } from "react";
import "@/app/_styles/global.css";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";

import { Menu, MoveLeft, Search, User, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import ProductContext from "@/context/ProductContext";
import Image from "next/image";

const categories = [
  { title: "Electronics", href: "/categories/electronics" },
  { title: "Fashion", href: "/categories/fashion" },
  { title: "Home & Living", href: "/categories/home-living" },
  { title: "Beauty & Health", href: "/categories/beauty-health" },
  { title: "Sports & Outdoors", href: "/categories/sports-outdoors" },
];

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prods, setProds] = useState([]);
  const [loader, setLoader] = useState(false);
  const query = searchParams.get("q") || "";

  const { products, isLoading } = useContext(ProductContext) || {
    products: [],
    isLoading: false,
  };

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      if (!query) {
        setProds([]);
        return;
      }
      setLoader(true);
      try {
        const decodedQuery = decodeURIComponent(query).toLowerCase().trim();
        const searchTerms = decodedQuery.split(/\s+/);

        const filteredProducts = products
          ?.filter((product) => {
            product.image = product.image?.replace(/[\[\]"]/g, "");
            const categoryTree =
              product.product_category_tree
                ?.replace(/[\[\]"]/g, "")
                .toLowerCase() || "";
            const brand =
              product.brand?.replace(/[\[\]"]/g, "").toLowerCase() || "";
            const productName = product.product_name?.toLowerCase() || "";
            const description =
              product.description?.replace(/[\[\]"]/g, "").toLowerCase() || "";
            const productUrl = product.product_url?.toLowerCase() || "";

            return searchTerms.every((term) => {
              return (
                productName.includes(term) ||
                description.includes(term) ||
                categoryTree.includes(term) ||
                brand.includes(term) ||
                productUrl.includes(term)
              );
            });
          })
          .slice(100, 400);

        console.log(filteredProducts);
        setProds(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchAndFilterProducts();
  }, [query, products]);

  const isClient = typeof window !== "undefined";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsBottomNavVisible(
        window.innerHeight + window.scrollY <
          document.documentElement.scrollHeight
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
      setProds([]);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-90 backdrop-blur-lg shadow-md"
            : "bg-white"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex flex-row gap-5 items-center">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoveLeft />
            </button>

            {isClient && (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="flex space-x-6">
                  <NavigationMenuItem>
                    <span>Categories</span>
                    <NavigationMenuContent>
                      <ul className="grid w-[250px] gap-3 p-4 bg-white shadow-lg rounded-md">
                        {categories.map((category) => (
                          <ListItem
                            key={category.title}
                            title={category.title}
                            href={category.href}
                          />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/deals" passHref>
                      <span>Deals</span>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/" passHref>
                      <span>Contact Us</span>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Search Bar */}
          {isClient && (
            <div className="relative w-full max-w-[400px]">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5"
                  aria-label="Search"
                >
                  <Search className="text-gray-400" size={18} />
                </button>
              </form>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
                aria-label="Profile"
              >
                <User className="w-6 h-6" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900"
                aria-label="Login"
              >
                <User className="w-6 h-6" />
              </Link>
            )}

            <button
              className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isClient && mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md mt-2 absolute w-full left-0">
            <ul className="flex flex-col p-4 space-y-2">
              <li>
                <Link
                  href="/categories"
                  className="block p-2 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Categories
                </Link>
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

      <div className="container mx-auto p-6 mt-10">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{query}"
        </h1>
        {loader ? (
          <p>Loading...</p>
        ) : prods?.length === 0 ? (
          <p>No products found. Try another search.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {prods.slice(0, 100).map((product) => {
              const imageUrl =
                product.image &&
                /^https?:\/\//.test(
                  product.image.replace(/\s+/g, "").replace(/[\[\]]/g, "")
                )
                  ? product.image.replace(/\s+/g, "").replace(/[\[\]]/g, "")
                  : "/lamp.jpg";
              return (
                <div
                  key={product.uniq_id}
                  className="border p-4 rounded-md cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/product/${product.uniq_id}`)}
                >
                  <Image
                    src={imageUrl}
                    alt={product.product_name}
                    width={160}
                    height={160}
                    className="w-full h-40 object-cover rounded-md"
                    unoptimized={true} // Disable Next.js image optimization for external URLs
                  />
                  <h2 className="text-lg font-medium mt-2">
                    {product.product_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ₹{product.discounted_price}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <BottomNavigation visible={isBottomNavVisible} />
      </div>
    </>
  );
};

const ListItem = ({ title, href }) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md transition"
      >
        {title}
      </Link>
    </NavigationMenuLink>
  </li>
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
