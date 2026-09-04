"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useSellerProducts } from "@/hooks/useSellerProducts";
import PageLoader from "./PageLoader";
import ProductCard from "./ProductCard";

export default function ProductSeller() {
  const { products: sellerProducts, isLoading, error } = useSellerProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="storefront-section py-24 text-center text-rose-500">
        Failed to load products.
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="storefront-section min-h-screen py-12"
    >
      <div className="storefront-panel px-6 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="storefront-kicker">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Popular Picks
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950 md:text-4xl">
              Recent Products Worth Checking Out
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              A quick browse through products that are getting fresh attention on
              the platform.
            </p>
          </div>
          <span className="storefront-chip">
            {sellerProducts?.length || 0} live products
          </span>
        </div>

        {sellerProducts?.length === 0 ? (
          <div className="storefront-empty px-6 py-12 text-center text-slate-500">
            No seller products available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sellerProducts.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
