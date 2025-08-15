"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import CyberLoader from "./CyberLoader";
import ProductCard from "./ProductCard";

export default function ProductSeller() {
  const { products: sellerProducts, isLoading, error } = useSellerProducts();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CyberLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Failed to load products.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Popular Products, The most recent ones
        </h1>

        {sellerProducts?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No seller products available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellerProducts?.map((product) => {
              return <ProductCard key={product?._id} product={product} />;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
