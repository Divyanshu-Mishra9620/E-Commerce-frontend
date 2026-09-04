"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, StarIcon } from "lucide-react";
import toast from "react-hot-toast";

import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  getDiscountPercent,
  getDisplayPrices,
  getReviewSummary,
  RUPEE_SYMBOL,
  sanitizeProductImage,
} from "@/lib/product-display";

const ProductCard = ({
  product,
  badgeText,
  badgeColor = "from-slate-900 via-blue-700 to-cyan-500",
  className = "",
}) => {
  const router = useRouter();
  const { isItemInWishlist, removeItem, addToWishlist } = useWishlist();

  const [isUpdating, setIsUpdating] = useState(false);

  const inWishlist = isItemInWishlist(product?._id);
  const discountPercent = getDiscountPercent(product);
  const { salePrice, originalPrice } = getDisplayPrices(product);
  const { rating, count } = getReviewSummary(product);
  const roundedRating = Math.round(rating);

  const handleCardClick = () => {
    router.push(`/product/${product?.uniq_id}`);
  };

  const handleHeartClick = async (event) => {
    event.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (inWishlist) {
        await removeItem(product?._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsUpdating(false);
    }
  };

  const topBadges = [];

  if (badgeText) {
    topBadges.push(
      <span
        key="badge"
        className={cn(
          "inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg",
          badgeColor
        )}
      >
        {badgeText}
      </span>
    );
  }

  if (discountPercent > 0) {
    topBadges.push(
      <span
        key="discount"
        className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-500/20"
      >
        {discountPercent}% off
      </span>
    );
  }

  return (
    <motion.article
      onClick={handleCardClick}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.42)] transition-all duration-300",
        "hover:border-blue-200 hover:shadow-[0_34px_80px_-42px_rgba(37,99,235,0.32)]",
        className
      )}
      layout
      whileHover={{ y: -6 }}
    >
      <div className="relative aspect-[4/4.5] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <Image
          src={sanitizeProductImage(product?.image)}
          alt={product?.product_name || "Product Image"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-white/10" />

        <div className="absolute left-3 top-3 z-10 flex max-w-[70%] flex-wrap gap-2">
          {topBadges}
        </div>

        <button
          type="button"
          onClick={handleHeartClick}
          disabled={isUpdating}
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-400 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-200",
              inWishlist && "fill-rose-500 text-rose-500"
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            {product?.category || "Curated"}
          </span>
          <span className="text-slate-300">/</span>
          <span>{count > 0 ? `${count} reviews` : "Fresh pick"}</span>
        </div>

        <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold leading-7 text-slate-950 transition-colors duration-200 group-hover:text-blue-700">
          {product?.product_name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={cn(
                  "h-4 w-4",
                  index < roundedRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {count > 0 ? `${rating.toFixed(1)} rating` : "No reviews yet"}
          </span>
        </div>

        <div className="mt-4 h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent" />

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-950">
              {RUPEE_SYMBOL}
              {formatCurrency(salePrice)}
            </p>
            {originalPrice > salePrice && (
              <p className="mt-1 text-sm text-slate-400 line-through">
                {RUPEE_SYMBOL}
                {formatCurrency(originalPrice)}
              </p>
            )}
          </div>

          <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 group-hover:bg-blue-600">
            View
          </span>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
          Ready to ship
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
