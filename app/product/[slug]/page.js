"use client";

import React, { useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import ProductContext from "@/context/ProductContext";
import CyberLoader from "@/components/CyberLoader";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductDetailsAccordion } from "@/components/ProductDetailsAccordion";
import { SimilarProductsList } from "@/components/SimilarProductsList";
import { ReviewSection } from "@/components/ReviewSection";

const PriceDisplay = ({ product }) => (
  <div className="flex items-center">
    <span className="text-3xl font-bold text-emerald-600">
      ₹{product.discounted_price}
    </span>
    {product.retail_price > product.discounted_price && (
      <span className="ml-4 text-gray-500 line-through text-lg">
        ₹{product.retail_price}
      </span>
    )}
  </div>
);

const RatingDisplay = ({ rating = 4.5 }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))}
    <span className="ml-2 text-sm text-gray-600">({rating} ratings)</span>
  </div>
);

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;

  const { products, isLoading: areProductsLoading } =
    useContext(ProductContext);

  const product = useMemo(
    () => products.find((p) => p.uniq_id === slug),
    [products, slug]
  );
  if (!slug) return null;

  if (areProductsLoading) {
    return <CyberLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-14">
      <div className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProductGallery product={product} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl font-bold leading-tight text-gray-900">
              {product.product_name}
            </h1>

            <RatingDisplay />
            <PriceDisplay product={product} />

            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <ProductActions product={product} />

            <ProductDetailsAccordion product={product} />
          </motion.div>
        </div>

        <SimilarProductsList currentProduct={product} allProducts={products} />

        <ReviewSection productId={product._id} className="mt-16" />
      </div>
    </div>
  );
}
