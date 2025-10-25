"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, ShoppingCart, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";

const Wishlist = () => {
  const router = useRouter();
  const { wishlistItems, isLoading, error, removeItem } = useWishlist();
  const { addToCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredItems = useMemo(() => {
    let items =
      wishlistItems?.filter(
        (item) => item?.product && !item.product.isDeleted
      ) || [];

    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      items = items.filter((item) => {
        const price = item.product?.discounted_price || 0;
        return max ? price >= min && price <= max : price >= min;
      });
    }

    const sorted = [...items];
    switch (sortBy) {
      case "price-low":
        sorted.sort(
          (a, b) =>
            (a.product?.discounted_price || 0) -
            (b.product?.discounted_price || 0)
        );
        break;
      case "price-high":
        sorted.sort(
          (a, b) =>
            (b.product?.discounted_price || 0) -
            (a.product?.discounted_price || 0)
        );
        break;
      case "newest":
      default:
        sorted.reverse();
    }

    return sorted;
  }, [wishlistItems, sortBy, priceFilter]);

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      await action();
    } catch (err) {
      console.error("Action failed:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = (productId) => {
    handleAction(async () => {
      await removeItem(productId);
      toast.success("Removed from wishlist");
    });
  };

  const handleMoveToCart = (item) => {
    handleAction(async () => {
      await addToCart(item.product, 1);
      await removeItem(item.product._id);
      toast.success("Moved to cart!");
    });
  };

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          {filteredItems?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8 p-8 bg-gradient-to-br from-red-100 to-pink-50 rounded-full"
              >
                <Heart className="w-20 h-20 text-red-600" fill="currentColor" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-3 text-slate-900">
                Your Wishlist is Empty
              </h2>
              <p className="text-slate-600 mb-8 max-w-md text-center text-lg">
                Start curating your perfect collection. Save items you love and
                we'll help you find amazing deals!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                onClick={() => router.push("/")}
              >
                <ShoppingBag size={20} /> Explore Products
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter className="w-4 h-4 inline mr-2" />
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-500">Under ₹500</option>
                      <option value="500-1000">₹500 - ₹1000</option>
                      <option value="1000-5000">₹1000 - ₹5000</option>
                      <option value="5000-">Above ₹5000</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <p className="text-sm text-slate-600 font-medium">
                      Showing{" "}
                      <span className="text-blue-600 font-bold">
                        {filteredItems?.length}
                      </span>{" "}
                      result
                      {filteredItems?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredItems?.map((item, index) => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <Image
                          src={
                            item.product.image?.replaceAll(/\s+|[\[\]]/g, "") ||
                            "/lamp.jpg"
                          }
                          alt={item.product.product_name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToCart(item);
                            }}
                            disabled={isProcessing}
                          >
                            <ShoppingCart size={18} /> Move to Cart
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:bg-red-50 transition-all z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.product._id);
                          }}
                          disabled={isProcessing}
                          aria-label="Remove from wishlist"
                        >
                          <Heart className="w-5 h-5 text-red-600 fill-current" />
                        </motion.button>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold line-clamp-2 text-slate-900 mb-2 flex-grow">
                          {item.product.product_name}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-slate-600">
                              (0 reviews)
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-2xl font-bold text-blue-600">
                              ₹
                              {item.product.discounted_price?.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                            {item.product.original_price >
                              item.product.discounted_price && (
                              <span className="text-sm text-slate-500 line-through">
                                ₹
                                {item.product.original_price?.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(Wishlist);
