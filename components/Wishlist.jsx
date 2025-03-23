"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const WishlistSection = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.email) {
          throw new Error("User not found in localStorage");
        }

        const response = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`);
        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const data = await response.json();
        setWishlistItems(data.items || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl text-gray-500">
          Loading your curated selections...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[50vh] text-red-400"
      >
        Error loading wishlist: {error}
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
          Saved Selections
          <span className="ml-3 text-gray-400 dark:text-gray-500">❤</span>
        </h3>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            No items saved yet
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={item.product}
                  className="hover:shadow-xl transition-shadow"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default WishlistSection;
