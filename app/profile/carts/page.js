"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import {
  Trash2,
  MoveLeft,
  Search,
  ShoppingCart,
  User,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from "use-debounce";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const Cart = () => {
  const { cartItems, loading, error, removeItem, updateQuantity, fetchCart } =
    useCart();
  const [searchInput, setSearchInput] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [debouncedSearchInput] = useDebounce(searchInput, 300);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const openModal = (itemId) => {
    setSelectedItem(itemId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleDelete = (productId) => {
    setShowModal(false);
    removeItem(productId);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please log in to add items to your wishlist");
      router.push("/api/auth/signin");
      return;
    }
    console.log(productId);

    try {
      const res = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Item moved to wishlist!", { position: "bottom-right" });
      } else {
        const errorData = await res.json();
        console.error("Failed to update wishlist:", errorData);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setShowModal(false);
    }
  };

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
      if (scrollY + windowHeight < fullHeight) {
        setIsBottomNavVisible(true);
      } else {
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems = useMemo(() => {
    return cartItems?.filter((item) =>
      item?.product?.product_name
        ?.toLowerCase()
        .includes(debouncedSearchInput.toLowerCase())
    );
  }, [debouncedSearchInput, cartItems]);

  const handleCartClick = (change, productId) => {
    const item = cartItems?.find((item) => item?.product?._id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const calculateTotal = useMemo(() => {
    return filteredItems?.reduce(
      (total, item) =>
        total + Number(item?.product?.discounted_price) * item?.quantity,
      0
    );
  }, [filteredItems]);

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
          </div>

          <div className="relative w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Search in cart..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/profile/carts" className="relative text-gray-700">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItems?.length}
              </span>
            </Link>
            <Link href="/profile" className="text-gray-700">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="my-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))
        ) : cartItems?.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-screen space-y-4">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
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
                  Your Cart
                </h1>

                {/* Cart Items */}
                <div className="space-y-4">
                  {filteredItems?.length > 0 ? (
                    filteredItems?.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="w-16 h-16 relative">
                          <Image
                            src={
                              item.product.image
                                .replace(/\s+/g, "")
                                .replace(/[\[\]]/g, "") || "/lamp.jpg"
                            }
                            alt={item.product.product_name || "cart"}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            priority
                          />
                        </div>
                        <div className="flex-1 ml-4">
                          <p className="text-sm font-medium text-gray-800">
                            {item.product.product_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹
                            {Number(item.product.discounted_price) *
                              item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-transform transform hover:scale-105"
                            onClick={() =>
                              handleCartClick(-1, item.product._id)
                            }
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-sm font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-transform transform hover:scale-105"
                            onClick={() => handleCartClick(1, item.product._id)}
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          aria-label="Delete item"
                          onClick={() => openModal(item.product._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {showModal && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                              onClick={closeModal}
                            >
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                className="bg-white p-6 rounded-lg shadow-lg relative"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                  onClick={closeModal}
                                >
                                  <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-xl font-bold mb-4">
                                  What would you like to do?
                                </h2>
                                <div className="flex gap-4">
                                  <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => toggleWishlist(selectedItem)}
                                  >
                                    Move to Wishlist
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                    onClick={() => handleDelete(selectedItem)}
                                  >
                                    Confirm Delete
                                  </button>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      No items match your search.
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      Total:
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      ₹{calculateTotal}
                    </p>
                  </div>
                </div>

                <div className="fixed bottom-20 right-4 z-50">
                  <button
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    onClick={() => router.push("/payment")}
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNavigation visible={isBottomNavVisible} />
    </>
  );
};

export default withAuth(Cart);
