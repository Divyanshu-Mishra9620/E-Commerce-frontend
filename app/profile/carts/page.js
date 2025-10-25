"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, X, Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import "react-toastify/dist/ReactToastify.css";

import withAuth from "@/components/withAuth";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { cartItems, isLoading, error, removeItem, updateQuantity, cartTotal } =
    useCart();
  const { addToWishlist } = useWishlist();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [debouncedSearchInput] = useDebounce(searchInput, 300);

  const itemsSubtotal = useMemo(() => {
    return (
      cartItems?.reduce((sum, item) => {
        return sum + (item.product?.discounted_price || 0) * item.quantity;
      }, 0) || 0
    );
  }, [cartItems]);

  const estimatedTax = useMemo(() => {
    return itemsSubtotal * 0.1;
  }, [itemsSubtotal]);

  const estimatedShipping = useMemo(() => {
    return itemsSubtotal > 500 ? 0 : 50;
  }, [itemsSubtotal]);

  const openModal = (productId) => {
    setSelectedItem(productId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleDelete = (productId) => {
    removeItem(productId);
    closeModal();
  };

  const moveToWishlist = async (product) => {
    if (!user) return toast.error("Please log in first.");

    await addToWishlist(product);
    await removeItem(product._id);

    toast.success("Item moved to wishlist!");
    closeModal();
  };

  const handleQuantityChange = (productId, change) => {
    const item = cartItems.find((item) => item.product._id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      openModal(item.product);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const filteredItems = useMemo(() => {
    if (!cartItems) return [];
    return cartItems.filter((item) =>
      item.product?.product_name
        ?.toLowerCase()
        .includes(debouncedSearchInput.toLowerCase())
    );
  }, [debouncedSearchInput, cartItems]);

  if (isLoading || authLoading)
    return (
      <div className="min-h-screen bg-slate-50">
        <PageLoader />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">
            Error: {error.message}
          </p>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
            {cartItems?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="relative">
                  <Search
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products in cart..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-500 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {cartItems?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-8 p-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full"
                >
                  <Package className="w-20 h-20 text-blue-600" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-3 text-slate-900">
                  Your Cart is Empty
                </h2>
                <p className="text-slate-600 mb-8 max-w-md text-center text-lg">
                  Start shopping and discover amazing products tailored just for
                  you.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200"
                  onClick={() => router.push("/")}
                >
                  Discover Products
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
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
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
                      >
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                          <Image
                            src={
                              item.product.image?.replaceAll(
                                /\s+|[\[\]]/g,
                                ""
                              ) || "/lamp.jpg"
                            }
                            alt={item.product.product_name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">
                            {item.product.product_name}
                          </h3>
                          <p className="text-slate-600 text-sm mb-3">
                            ₹
                            {item.product.discounted_price.toLocaleString(
                              "en-IN"
                            )}{" "}
                            each
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="text-slate-600 hover:text-blue-600 transition-colors p-1"
                                onClick={() =>
                                  handleQuantityChange(item.product._id, -1)
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              <motion.span
                                key={`${item.product._id}-${item.quantity}`}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="font-semibold w-6 text-center text-slate-900"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="text-slate-600 hover:text-blue-600 transition-colors p-1"
                                onClick={() =>
                                  handleQuantityChange(item.product._id, 1)
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>
                            <span className="text-sm text-slate-500">
                              {item.quantity > 1 && `× ${item.quantity}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-2">
                          <div className="text-right">
                            <span className="text-lg font-bold text-blue-600">
                              ₹
                              {(
                                item.product.discounted_price * item.quantity
                              ).toLocaleString("en-IN")}
                            </span>
                            <p className="text-xs text-slate-500">
                              {item.quantity} × ₹
                              {item.product.discounted_price.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                              onClick={() =>
                                router.push(
                                  `/payment?productId=${item.product._id}&quantity=${item.quantity}`
                                )
                              }
                              title="Buy this product"
                            >
                              Buy Now
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                              onClick={() => openModal(item.product)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-1"
                >
                  <div className="sticky top-24 space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6">
                        Order Summary
                      </h3>

                      <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Subtotal</span>
                          <span className="font-semibold text-slate-900">
                            ₹
                            {itemsSubtotal.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Estimated Tax</span>
                          <span className="font-semibold text-slate-900">
                            ₹
                            {estimatedTax.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Shipping</span>
                          <span className="font-semibold text-slate-900">
                            {estimatedShipping === 0 ? (
                              <span className="text-green-600">Free</span>
                            ) : (
                              `₹${estimatedShipping.toLocaleString("en-IN")}`
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold text-slate-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹
                          {(
                            itemsSubtotal +
                            estimatedTax +
                            estimatedShipping
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 mb-3"
                        onClick={() => router.push("/payment")}
                      >
                        Proceed to Checkout
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-colors duration-200"
                        onClick={() => router.push("/")}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
                    >
                      <p className="text-sm text-green-700">
                        💚 <span className="font-semibold">Free shipping</span>{" "}
                        on orders over ₹500
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-xl max-h-[calc(100vh-2rem)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Manage Item
                </h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <p className="text-slate-600 text-center mb-6">
                What would you like to do with{" "}
                <span className="font-semibold text-slate-900">
                  {selectedItem?.product_name}
                </span>
                ?
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  onClick={() => moveToWishlist(selectedItem)}
                >
                  Move to Wishlist
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  onClick={() => handleDelete(selectedItem._id)}
                >
                  <Trash2 className="w-5 h-5" />
                  Remove from Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default withAuth(Cart);
