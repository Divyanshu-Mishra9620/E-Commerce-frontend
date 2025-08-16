"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useSimilarProducts } from "@/hooks/useSimilarProducts";

export function SimilarProductsList({ productId }) {
  const { similarProducts, isLoading } = useSimilarProducts(productId);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading similar products...
      </div>
    );

  if (similarProducts.length === 0) return null;

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
