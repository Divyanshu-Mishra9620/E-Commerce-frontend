"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import ProductCard from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";
import { motion } from "framer-motion";
import { authedFetch } from "@/utils/authedFetch";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const WishlistSection = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?._id;

  const swrKey = userId ? `/api/wishlist/${userId}` : null;

  const { data, error } = useSWR(swrKey, authedFetch, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
  if (status === "loading" || (!data && !error && status === "authenticated")) {
    return (
      <section className="mt-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-3xl font-semibold text-slate-900 mb-8">
            Saved Selections
            <span className="ml-3 text-slate-400">❤</span>
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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-3xl font-semibold text-slate-900 mb-8">
          Saved Selections
          <span className="ml-3 text-slate-400">❤</span>
        </h3>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-slate-500"
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
