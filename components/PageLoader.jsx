"use client";

import { motion } from "framer-motion";
import { SkeletonCard } from "./SkeletonCard";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_20%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_24%,#020617_100%)]"
    >
      <div className="storefront-section py-24">
        <div className="animate-pulse space-y-4 pb-10">
          <div className="h-5 w-32 rounded-full bg-slate-200"></div>
          <div className="h-12 w-72 rounded-full bg-slate-200"></div>
          <div className="h-4 w-80 max-w-full rounded-full bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
