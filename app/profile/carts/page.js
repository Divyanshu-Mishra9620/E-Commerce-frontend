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
      <div className="min-h-screen bg-gray-50">
        <PageLoader />
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Navbar />
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 mt-8"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in cart..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  className="absolute right-4 top-3.5 text-gray-400"
                  size={20}
                />
              </div>
            </motion.div>

            {cartItems?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="mb-6 p-6 bg-gray-100 rounded-full">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-gray-800">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
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
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={
                              item.product.image?.replace(/\s+|[\[\]]/g, "") ||
                              "/lamp.jpg"
                            }
                            alt={item.product.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 line-clamp-1">
                            {item.product.product_name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            ₹
                            {(
                              item.product.discounted_price * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() =>
                              handleQuantityChange(item.product._id, -1)
                            }
                          >
                            <Minus className="w-5 h-5" />
                          </motion.button>
                          <span className="font-medium w-4 text-center text-gray-800">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() =>
                              handleQuantityChange(item.product._id, 1)
                            }
                          >
                            <Plus className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-red-500 hover:text-red-600"
                          onClick={() => openModal(item.product)}
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
                    className="mt-8 pt-8 border-t border-gray-200"
                  >
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Total Amount
                        </h3>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                        onClick={() => router.push("/payment")}
                      >
                        Proceed to Checkout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Manage Item
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-center text-gray-600 mb-6">
                What would you like to do with{" "}
                <span className="font-semibold">
                  {selectedItem.product_name}
                </span>
                ?
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2"
                  onClick={() => moveToWishlist(selectedItem)}
                >
                  <span>Move to Wishlist</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center justify-center gap-2"
                  onClick={() => handleDelete(selectedItem._id)}
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
  );
};

export default withAuth(Cart);
