"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame } from "lucide-react";

import SectionHeading from "@/components/fx/SectionHeading";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { EASE_OUT_EXPO } from "@/lib/motion";
import PageLoader from "./PageLoader";
import ProductCard from "./ProductCard";

export default function ProductSeller() {
  const reduceMotion = useReducedMotion();
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
    <section className="storefront-section min-h-screen py-10">
      <SectionHeading
        as="h1"
        kicker="Popular picks"
        icon={Flame}
        title="Recent products"
        highlight="worth checking out"
        description="A quick browse through products getting fresh attention on the platform."
        action={
          <span className="storefront-chip">
            <span className="font-display text-base font-bold text-slate-950">
              {sellerProducts?.length || 0}
            </span>
            live products
          </span>
        }
      />

      {sellerProducts?.length === 0 ? (
        <div className="storefront-empty px-6 py-12 text-center text-slate-500">
          No seller products available.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {sellerProducts.map((product, index) => (
            <motion.div
              key={product?._id}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: (index % 4) * 0.07 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
