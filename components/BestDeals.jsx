"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Sparkles, Star } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useDragScroll } from "@/hooks/useDragScroll";
import {
  formatCurrency,
  getDisplayPrices,
  getReviewSummary,
  RUPEE_SYMBOL,
  sanitizeProductImage,
} from "@/lib/product-display";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "./SkeletonCard";
import Spinner from "./Spinner";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function BestDeals({ products }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const productList = Array.isArray(products) ? products : [];
  const { setCartItems } = useCart();
  const [isPending, startTransition] = useTransition();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { user, isLoading: authLoading } = useAuth();

  useDragScroll(scrollRef);

  async function handleCartClick(deal, event) {
    event.stopPropagation();

    let loadingToastId;

    try {
      if (!user?._id) {
        router.push("/api/auth/signin");
        toast.error("Please sign in to add items to cart");
        return;
      }

      const userCarts = JSON.parse(localStorage.getItem("cart") || "{}");
      const existingItem = userCarts?.cart?.items?.find(
        (item) => item.product === deal._id
      );

      loadingToastId = toast.loading("Adding to cart...");

      const response = await fetch(`${BACKEND_URI}/api/cart/${user?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: deal._id,
          quantity: existingItem ? existingItem.quantity + 1 : 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const updatedCart = await response.json();
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart.cart.items);

      toast.success("Item added to cart!", {
        id: loadingToastId,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart!", {
        id: loadingToastId,
        position: "bottom-right",
      });
    }
  }

  const handleDeals = (uniqId) => {
    startTransition(() => {
      router.push(`/product/${uniqId}`);
    });
  };

  if (authLoading) {
    return (
      <section className="storefront-section py-12">
        <div className="storefront-panel px-6 py-8 md:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
          <Spinner size="lg" className="text-white" />
        </div>
      )}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="storefront-section py-12"
      >
        <div className="storefront-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="storefront-kicker">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                Limited-Time Prices
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950 md:text-4xl">
                Best Deals Worth Grabbing Today
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                A fast lane of standout offers from the latest catalog, styled
                for quick browsing and even quicker checkout.
              </p>
            </div>

            <span className="storefront-chip">Drag sideways to explore</span>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          >
            {productList.map((deal, index) => {
              const { salePrice, originalPrice } = getDisplayPrices(deal);
              const { rating, count } = getReviewSummary(deal);

              return (
                <motion.article
                  key={deal._id || deal.uniq_id || index}
                  className="w-[300px] flex-shrink-0 snap-start sm:w-[320px]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    className={cn(
                      "group h-full overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_30px_70px_-48px_rgba(15,23,42,0.42)] transition-all duration-300",
                      hoveredCard === index &&
                        "border-blue-200 shadow-[0_34px_90px_-44px_rgba(37,99,235,0.32)]"
                    )}
                    whileHover={{ y: -6 }}
                    onClick={() => handleDeals(deal.uniq_id)}
                  >
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50">
                      <Image
                        src={sanitizeProductImage(deal.image)}
                        alt={deal.product_name || "Product image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-500/20">
                        Hot pick
                      </div>

                      <div className="absolute bottom-4 left-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur-sm">
                        {RUPEE_SYMBOL}
                        {formatCurrency(salePrice)}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {deal?.category || "Featured"}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                          Save {originalPrice > salePrice ? `${RUPEE_SYMBOL}${formatCurrency(originalPrice - salePrice)}` : "More"}
                        </span>
                      </div>

                      <h4 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-slate-950">
                        {deal.product_name}
                      </h4>

                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={cn(
                                "h-4 w-4",
                                starIndex < Math.round(rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              )}
                            />
                          ))}
                        </div>
                        <span>
                          {count > 0 ? `${rating.toFixed(1)} from ${count} reviews` : "Fresh arrival"}
                        </span>
                      </div>

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

                        <button
                          type="button"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-blue-600"
                          onClick={(event) => handleCartClick(deal, event)}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                        View product details
                        <ArrowRight className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.section>
    </>
  );
}
