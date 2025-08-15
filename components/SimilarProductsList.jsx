"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export function SimilarProductsList({ currentProduct, allProducts }) {
  const similarProducts = useMemo(() => {
    if (!currentProduct || !allProducts) return [];

    const getKeywords = (product) =>
      new Set([
        ...(product.product_name || "").toLowerCase().split(" "),
        ...(product.category || "").toLowerCase().split(" "),
      ]);

    const currentKeywords = getKeywords(currentProduct);

    return allProducts
      .filter((p) => p.uniq_id !== currentProduct.uniq_id)
      .map((p) => {
        const otherKeywords = getKeywords(p);
        const intersection = new Set(
          [...currentKeywords].filter((kw) => otherKeywords.has(kw))
        );
        return { product: p, score: intersection.size };
      })
      .filter((p) => p.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((p) => p.product);
  }, [currentProduct, allProducts]);

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {similarProducts.map((product) => (
          <ProductCard key={product.uniq_id} product={product} />
        ))}
      </div>
    </section>
  );
}
