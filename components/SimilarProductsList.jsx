"use client";

import ProductCard from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";
import { useSimilarProducts } from "@/hooks/useSimilarProducts";

export function SimilarProductsList({ productId }) {
  const { similarProducts, isLoading } = useSimilarProducts(productId);

  if (isLoading) {
    return (
      <section className="mt-16">
        <div className="mb-8 space-y-3">
          <span className="storefront-kicker">Related Picks</span>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950">
            Similar Products
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (similarProducts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="storefront-kicker">Related Picks</span>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">
            Similar Products
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
            More products that match the style, category, or shopper behavior of
            this item.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {similarProducts.map((product) => (
          <ProductCard key={product._id || product.uniq_id} product={product} />
        ))}
      </div>
    </section>
  );
}
