"use client";

import { motion } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { authedFetch } from "@/utils/authedFetch";
import ProductCard from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";

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
      <section className="storefront-section py-12">
        <div className="storefront-panel px-6 py-8 md:px-8">
          <div className="mb-8 flex flex-col gap-3">
            <span className="storefront-kicker">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              Wishlist
            </span>
            <h3 className="text-3xl font-black tracking-[-0.05em] text-slate-950">
              Saved Selections
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="storefront-section py-12">
        <div className="storefront-empty flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-200/60">
            <Lock className="h-6 w-6 text-slate-500" />
          </span>
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              Sign in to view your wishlist
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
              Your saved products will appear here once you log in and start
              bookmarking items.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="storefront-section py-12">
        <div className="storefront-empty px-6 py-12 text-center text-rose-500">
          Error loading wishlist: {error.message}
        </div>
      </div>
    );
  }

  const wishlistItems = data?.items || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="storefront-section py-12"
    >
      <div className="storefront-panel px-6 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="storefront-kicker">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              Wishlist
            </span>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">
              Saved Selections
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              A neat shelf of the products you want to revisit later.
            </p>
          </div>

          <span className="storefront-chip">
            {wishlistItems.length} item{wishlistItems.length === 1 ? "" : "s"} saved
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="storefront-empty px-6 py-12 text-center text-slate-500">
            No items saved yet. Go on, find something you love.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.product?._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
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
