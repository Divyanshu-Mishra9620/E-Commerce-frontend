"use client";

import { motion } from "framer-motion";
import { SkeletonCard } from "./SkeletonCard";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-50 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mt-8">
        <div className="animate-pulse space-y-4 mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
