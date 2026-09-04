"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import PageLoader from "@/components/PageLoader";
import { ProductActions } from "@/components/ProductActions";
import { ProductDetailsAccordion } from "@/components/ProductDetailsAccordion";
import { ProductGallery } from "@/components/ProductGallery";
import { ReviewSection } from "@/components/ReviewSection";
import { SimilarProductsList } from "@/components/SimilarProductsList";
import { useProduct } from "@/hooks/useProduct";
import {
  formatCurrency,
  getReviewSummary,
  RUPEE_SYMBOL,
} from "@/lib/product-display";

const PriceDisplay = ({ product }) => (
  <div className="flex flex-wrap items-end gap-3">
    <span className="text-4xl font-black tracking-[-0.05em] text-slate-950">
      {RUPEE_SYMBOL}
      {formatCurrency(product.discounted_price)}
    </span>
    {Number(product.retail_price) > Number(product.discounted_price) && (
      <span className="pb-1 text-lg text-slate-400 line-through">
        {RUPEE_SYMBOL}
        {formatCurrency(product.retail_price)}
      </span>
    )}
  </div>
);

const RatingDisplay = ({ product }) => {
  const { rating, count } = getReviewSummary(product);
  const displayRating = rating || 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < Math.round(displayRating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-slate-500">
        {count > 0 ? `${displayRating.toFixed(1)} from ${count} reviews` : "No reviews yet"}
      </span>
    </div>
  );
};

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const { product, isLoading, error } = useProduct(slug);

  if (isLoading) return <PageLoader />;

  if (error || !product) {
    return (
      <div className="storefront-section flex min-h-screen items-center justify-center py-24 text-slate-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="storefront-section py-24">
      <div className="storefront-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProductGallery product={product} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <span className="storefront-kicker">Product Detail</span>
            <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-950">
              {product.product_name}
            </h1>

            <RatingDisplay product={product} />
            <PriceDisplay product={product} />

            <p className="text-base leading-8 text-slate-600">
              {product.description}
            </p>

            <ProductActions product={product} />
            <ProductDetailsAccordion product={product} />
          </motion.div>
        </div>

        <SimilarProductsList productId={product._id} />
        <ReviewSection productId={product._id} />
      </div>
    </div>
  );
}
