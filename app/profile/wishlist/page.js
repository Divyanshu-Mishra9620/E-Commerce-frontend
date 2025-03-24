"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/app/_styles/global.css";
import withAuth from "@/components/withAuth";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
const Wishlist = () => {
  const router = useRouter();
  const { wishlistItems, loading, error, removeItem, fetchWishlist } =
    useWishlist();
  const [showLoader, setShowLoader] = useState(true);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timerRef.current);
  }, []);

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    console.log(productId);

    toast.success("Removed from wishlist", {
      position: "bottom-right",
      className: "bg-gray-800 text-gray-100",
    });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      {showLoader || loading ? (
        <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
          <Image
            src="/underConstruction.gif"
            alt="Loading..."
            width={200}
            height={200}
            priority
            unoptimized
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gray-800 opacity-30 mix-blend-multiply" />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Saved Items
                <span className="ml-3 text-gray-500 text-lg">
                  ({wishlistItems?.length || 0})
                </span>
              </h1>
            </motion.div>

            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-red-900/20 rounded-xl text-red-400 text-center"
              >
                Error loading wishlist: {error}
              </motion.div>
            ) : wishlistItems?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="mb-6 p-6 bg-gray-800 rounded-full">
                  <Heart
                    className="w-16 h-16 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Your Wishlist is Empty
                </h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Start curating your perfect selection of products
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-medium hover:shadow-lg"
                  onClick={() => router.push("/")}
                >
                  <ShoppingBag className="mr-2 inline-block" size={20} />
                  Explore Products
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <AnimatePresence>
                  {wishlistItems?.map((item) => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={
                            item.product.image
                              .replace(/\s+/g, "")
                              .replace(/[\[\]]/g, "") || "/lamp.png"
                          }
                          alt={item.product.product_name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                      </div>

                      <div className="mt-4">
                        <h3 className="font-medium line-clamp-1 text-gray-200">
                          {item.product.product_name}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-semibold text-gray-200">
                            ₹{item.product.discounted_price}
                          </span>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-gray-400 hover:text-gray-200"
                              onClick={() =>
                                router.push(`/product/${item.product.uniq_id}`)
                              }
                            >
                              <Info className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleRemoveItem(item.product._id)}
                            >
                              <Heart className="w-5 h-5 fill-current" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ x: 0 }}
                        className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {item.product.original_price && (
                          <span className="px-2 py-1 bg-gray-700 text-xs rounded line-through">
                            ₹{item.product.original_price}
                          </span>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(Wishlist);
