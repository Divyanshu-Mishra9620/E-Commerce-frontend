"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import { Menu, MoveLeft, User, Info, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const { wishlistItems, loading, error, removeItem, fetchWishlist } =
    useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (window.scrollY > 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (scrollY + windowHeight < fullHeight - 50) {
        setIsBottomNavVisible(true);
      } else {
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    toast.success("Removed from wishlist!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-90 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-700">
              <MoveLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Wishlist</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className="text-gray-700"
            >
              <User className="w-6 h-6" />
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-8 h-8 text-blue-600" />
          </motion.div>
        </div>
      ) : wishlistItems?.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <Heart className="w-16 h-16 text-gray-400" />
          <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen pt-20 pb-24">
          <div className="container mx-auto px-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Your Wishlist
              </h1>

              <div className="space-y-4">
                {wishlistItems?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={
                          item?.product?.image
                            ?.replace(/\s+/g, "")
                            .replace(/[\[\]]/g, "") || "/lamp.jpg"
                        }
                        alt={item.product_name || "wishlist Item"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        priority
                      />
                    </div>

                    <div className="flex-1 ml-4">
                      <p className="text-sm font-medium text-gray-800">
                        {item?.product?.product_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{item?.product?.discounted_price}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition"
                        onClick={() =>
                          router.push(`/product/${item?.product?.uniq_id}`)
                        }
                      >
                        <Info className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item?.product?._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation visible={isBottomNavVisible} />
    </>
  );
};

export default withAuth(Wishlist);
