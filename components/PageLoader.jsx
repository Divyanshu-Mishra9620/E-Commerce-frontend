"use client";

import { motion } from "framer-motion";
import { SkeletonCard } from "./SkeletonCard";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
      role="status"
      aria-label="Loading"
    >
      <div className="fixed inset-x-0 top-0 h-[3px] overflow-hidden bg-brand-500/10">
        <div className="h-full w-1/3 bg-brand-gradient motion-safe:animate-[loader-bar_1.4s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
      </div>

      <div className="storefront-section py-20">
        <div className="flex flex-col items-center gap-5 pb-14 text-center">
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-[#fff] shadow-xl shadow-brand-600/30">
            <span className="font-display text-2xl font-extrabold">E</span>
            <span className="absolute inset-0 rounded-2xl ring-2 ring-brand-400/50 motion-safe:animate-ping" />
          </span>
          <div className="space-y-3">
            <div className="skeleton-shimmer mx-auto h-8 w-64 max-w-full rounded-full" />
            <div className="skeleton-shimmer mx-auto h-4 w-80 max-w-full rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
