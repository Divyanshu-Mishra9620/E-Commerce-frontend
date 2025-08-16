"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import ProductCard from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";
import { motion } from "framer-motion";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const WishlistSection = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?._id;

  const swrKey = userId ? `${BACKEND_URI}/api/wishlist/${userId}` : null;

  const { data, error } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
  if (status === "loading" || (!data && !error && status === "authenticated")) {
    return (
      <section className="mt-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
            Saved Selections
            <span className="ml-3 text-gray-400 dark:text-gray-500">❤</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === "unauthenticated") {
    return (
      <motion.section className="text-center py-20">
        Please log in to see your wishlist.
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.div className="flex justify-center items-center min-h-[50vh] text-red-400">
        Error loading wishlist: {error.message}
      </motion.div>
    );
  }

  const wishlistItems = data?.items || [];

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
            No items saved yet. Go on, find something you love!
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.product?._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                {item.product && <ProductCard product={item.product} />}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default WishlistSection;
