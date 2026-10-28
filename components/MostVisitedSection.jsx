"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame, Radar } from "lucide-react";

import SectionHeading from "@/components/fx/SectionHeading";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { getReviewSummary } from "@/lib/product-display";
import ProductCard from "./ProductCard";

const MostVisitedSection = ({ products }) => {
  const reduceMotion = useReducedMotion();
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
    <section className="storefront-section py-12 md:py-16">
      <SectionHeading
        kicker="Trending picks"
        icon={Flame}
        title="Most loved"
        highlight="right now"
        description="Products drawing the most attention across the storefront."
        action={
          <span className="storefront-chip">
            <Radar className="h-4 w-4 text-brand-500 motion-safe:animate-spin-slow" />
            Based on recent activity
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {featuredItems.map((item, index) => (
          <motion.div
            key={item._id || item.uniq_id || index}
            initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: (index % 5) * 0.07 }}
          >
            <ProductCard
              product={item}
              badgeText={mostVisitedItems.length > 0 ? "Trending" : "New"}
              badgeColor={
                mostVisitedItems.length > 0
                  ? "from-coral-500 to-rose-500"
                  : "from-brand-600 to-fuchsia-500"
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MostVisitedSection;
