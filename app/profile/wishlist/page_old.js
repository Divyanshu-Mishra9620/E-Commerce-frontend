"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
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

  const filteredItems = wishlistItems?.filter(
    (item) => item?.product && !item.product.isDeleted
  );

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
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900">
              Saved Items
              <span className="ml-3 text-gray-500 text-lg font-medium">
                ({filteredItems?.length || 0})
              </span>
            </h1>
          </motion.div>

          {filteredItems?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="mb-6 p-6 bg-gray-100 rounded-full">
                <Heart className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-6 max-w-md text-center">
                Start curating your perfect selection of products.
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center"
              >
                <ShoppingBag className="mr-2" size={20} /> Explore Products
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredItems?.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-shadow flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={
                          item.product.image?.replace(/\s+|[\[\]]/g, "") ||
                          "/lamp.jpg"
                        }
                        alt={item.product.product_name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveToCart(item);
                          }}
                          disabled={isProcessing}
                        >
                          <ShoppingCart size={18} /> Move to Cart
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-medium line-clamp-2 text-gray-800 flex-grow">
                        {item.product.product_name}
                      </h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.product.discounted_price}
                        </span>
                        <button
                          className="text-red-500 hover:text-red-600 p-2 rounded-full z-10 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.product._id);
                          }}
                          disabled={isProcessing}
                          aria-label="Remove from wishlist"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(Wishlist);
