"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import BottomNavigation from "@/components/BottomNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, X, Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from "use-debounce";
import Navbar from "@/components/Navbar";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const Cart = () => {
  const { cartItems, loading, error, removeItem, updateQuantity, fetchCart } =
    useCart();
  const [searchInput, setSearchInput] = useState("");
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [debouncedSearchInput] = useDebounce(searchInput, 300);

  const [user, setUser] = useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/api/auth/signin");
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
      if (scrollY + windowHeight < fullHeight - 20) {
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
        total + (+item?.product?.discounted_price || 799) * item?.quantity,
      0
    );
  }, [filteredItems]);

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative mt-8">
              <input
                type="text"
                placeholder="Search in cart..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
              />
              <Search
                className="absolute right-4 top-3.5 text-gray-400"
                size={20}
              />
            </div>
          </motion.div>

          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-xl animate-pulse"
                >
                  <div className="w-20 h-20 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 ml-4 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : cartItems?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="mb-6 p-6 bg-gray-800 rounded-full">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Your Cart is Empty
              </h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Explore our premium collection and find something special
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-medium hover:shadow-lg"
                onClick={() => router.push("/")}
              >
                Discover Products
              </motion.button>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {filteredItems?.map((item, index) => (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={
                            item.product.image
                              .replace(/\s+/g, "")
                              .replace(/[\[\]]/g, "") || "/lamp.jpg"
                          }
                          alt={item.product.product_name}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">
                          {item.product.product_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          ₹
                          {(
                            (+item.product.discounted_price || 799) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-700 px-3 py-1 rounded-xl">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-300 hover:text-white"
                          onClick={() => handleCartClick(-1, item.product._id)}
                        >
                          <Minus className="w-5 h-5" />
                        </motion.button>
                        <span className="font-medium">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-300 hover:text-white"
                          onClick={() => handleCartClick(1, item.product._id)}
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-red-400 hover:text-red-300"
                        onClick={() => openModal(item.product._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredItems?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 pt-8 border-t border-gray-700"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Total Amount</h3>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      ₹{calculateTotal}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-semibold hover:shadow-xl transition-all"
                    onClick={() => router.push("/payment")}
                  >
                    Proceed to Checkout
                  </motion.button>
                </motion.div>
              )}

              <AnimatePresence>
                {showModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={closeModal}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Manage Item</h3>
                        <button
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-200"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2"
                          onClick={() => toggleWishlist(selectedItem)}
                        >
                          <span>Move to Wishlist</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="flex-1 py-3 bg-red-600/30 hover:bg-red-600/40 text-red-400 rounded-lg flex items-center justify-center gap-2"
                          onClick={() => handleDelete(selectedItem)}
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Remove</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
      <BottomNavigation visible={isBottomNavVisible} />
    </>
  );
};

export default withAuth(Cart);
