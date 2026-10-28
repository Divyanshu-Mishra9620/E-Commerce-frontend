"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart, StarIcon } from "lucide-react";
import toast from "react-hot-toast";

import { useWishlist } from "@/context/WishlistContext";
import { trackSpotlight } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  getCategoryLabel,
  getDiscountPercent,
  getDisplayPrices,
  getReviewSummary,
  pluralize,
  RUPEE_SYMBOL,
  sanitizeProductImage,
} from "@/lib/product-display";

const ProductCard = ({
  product,
  badgeText,
  badgeColor = "from-brand-600 via-fuchsia-500 to-coral-500",
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

  return (
    <motion.article
      onClick={handleCardClick}
      onPointerMove={trackSpotlight}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "spotlight group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_60px_-48px_rgba(35,18,79,0.45)] transition-shadow duration-500",
        "hover:shadow-[0_40px_80px_-40px_rgba(99,56,238,0.4)]",
        className
      )}
    >
      <div className="relative aspect-[4/4.4] overflow-hidden bg-slate-100">
        <Image
          src={sanitizeProductImage(product?.image)}
          alt={product?.product_name || "Product Image"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          draggable={false}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a14]/50 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 z-10 flex max-w-[70%] flex-wrap gap-1.5">
          {badgeText && (
            <span
              className={cn(
                "inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#fff] shadow-lg",
                badgeColor
              )}
            >
              {badgeText}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#fff] shadow-lg shadow-emerald-500/25">
              &minus;{discountPercent}%
            </span>
          )}
        </div>

        <motion.button
          type="button"
          onClick={handleHeartClick}
          disabled={isUpdating}
          whileTap={{ scale: 0.85 }}
          className="absolute right-3 top-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b0a14]/25 text-[#fff] shadow-lg backdrop-blur-md transition-colors duration-300 hover:bg-[#0b0a14]/45 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={inWishlist ? "on" : "off"}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.25, 1], opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="flex"
            >
              <Heart
                className={cn(
                  "h-[18px] w-[18px]",
                  inWishlist && "fill-rose-500 text-rose-500"
                )}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <span className="absolute bottom-3 left-3 z-10 inline-flex translate-y-3 items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-[#fff] opacity-0 backdrop-blur-md transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
          Quick view
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="truncate">{getCategoryLabel(product)}</span>
          <span className="shrink-0 normal-case tracking-normal">
            {count > 0 ? pluralize(count, "review") : "Fresh pick"}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[3rem] font-sans text-[15px] font-semibold leading-6 text-slate-950 transition-colors duration-300 group-hover:text-brand-700 dark:group-hover:text-brand-300">
          {product?.product_name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={cn(
                  "h-3.5 w-3.5",
                  index < roundedRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-white/15"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {count > 0 ? rating.toFixed(1) : "No reviews yet"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {RUPEE_SYMBOL}
              {formatCurrency(salePrice)}
            </p>
            {originalPrice > salePrice && (
              <p className="text-sm text-slate-400 line-through">
                {RUPEE_SYMBOL}
                {formatCurrency(originalPrice)}
              </p>
            )}
          </div>

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-transparent group-hover:bg-brand-600 group-hover:text-[#fff]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
