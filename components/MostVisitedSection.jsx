"use client";

import { motion } from "framer-motion";
import { Flame, Radar } from "lucide-react";

import ProductCard from "./ProductCard";
import { getReviewSummary } from "@/lib/product-display";

const MostVisitedSection = ({ products }) => {
  const productList = Array.isArray(products) ? products : [];

  const mostVisitedItems = productList
    .filter((product) => getReviewSummary(product).count > 0)
    .slice(0, 10);

  const featuredItems =
    mostVisitedItems.length > 0 ? mostVisitedItems : productList.slice(0, 10);

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="storefront-section py-12"
    >
      <div className="storefront-panel px-6 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="storefront-kicker">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              Trending Picks
            </span>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">
              Most Loved Right Now
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Products drawing the most attention across the storefront.
            </p>
          </div>

          <span className="storefront-chip">
            <Radar className="h-4 w-4 text-blue-500" />
            Based on recent user activity
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item._id || item.uniq_id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <ProductCard
                product={item}
                badgeText={mostVisitedItems.length > 0 ? "Trending" : "New"}
                badgeColor={
                  mostVisitedItems.length > 0
                    ? "from-rose-500 to-orange-400"
                    : "from-blue-600 to-cyan-500"
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default MostVisitedSection;
