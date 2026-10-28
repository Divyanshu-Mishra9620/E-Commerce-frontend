"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Flame, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";

import SectionHeading from "@/components/fx/SectionHeading";
import SliderRail from "@/components/fx/SliderRail";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { trackSpotlight } from "@/lib/motion";
import {
  formatCurrency,
  getCategoryLabel,
  getDiscountPercent,
  getDisplayPrices,
  getReviewSummary,
  RUPEE_SYMBOL,
  sanitizeProductImage,
} from "@/lib/product-display";
import { SkeletonCard } from "./SkeletonCard";
import Spinner from "./Spinner";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

function DealCard({ deal, onOpen, onAddToCart }) {
  const { salePrice, originalPrice } = getDisplayPrices(deal);
  const { rating, count } = getReviewSummary(deal);
  const discount = getDiscountPercent(deal);

  return (
    <article
      onPointerMove={trackSpotlight}
      onClick={() => onOpen(deal.uniq_id)}
      className="spotlight group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_60px_-45px_rgba(35,18,79,0.45)] transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-40px_rgba(99,56,238,0.45)]"
    >
      <div className="relative aspect-[4/3.6] overflow-hidden bg-slate-100">
        <Image
          src={sanitizeProductImage(deal.image)}
          alt={deal.product_name || "Product image"}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 24vw"
          draggable={false}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a14]/55 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-coral-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fff] shadow-lg shadow-coral-500/30">
            <Flame className="h-3 w-3" />
            Hot
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-[#fff] shadow-lg shadow-emerald-500/25">
              &minus;{discount}%
            </span>
          )}
        </div>

        <span className="absolute bottom-4 left-4 z-10 inline-flex translate-y-3 items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-[#fff] opacity-0 backdrop-blur-md transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
          Quick view
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {getCategoryLabel(deal, "Featured")}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {count > 0 ? rating.toFixed(1) : "New"}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[3rem] font-sans text-base font-semibold leading-6 text-slate-950">
          {deal.product_name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-slate-950">
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

          <button
            type="button"
            onClick={(event) => onAddToCart(deal, event)}
            className="relative z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0f0d1f] text-[#fff] shadow-lg shadow-brand-900/20 transition-all duration-300 ease-out-expo hover:scale-110 hover:bg-brand-600 active:scale-95 dark:bg-[#f0eeff] dark:text-[#0f0d1f] dark:hover:bg-brand-300"
            aria-label={`Add ${deal.product_name} to cart`}
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BestDeals({ products }) {
  const router = useRouter();
  const productList = Array.isArray(products) ? products : [];
  const { setCartItems } = useCart();
  const [isPending, startTransition] = useTransition();
  const { user, isLoading: authLoading } = useAuth();

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (productList.length === 0) {
    return null;
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
          <Spinner size="lg" className="text-white" />
        </div>
      )}

      <section className="storefront-section py-12 md:py-16">
        <SectionHeading
          kicker="Limited-time prices"
          icon={Flame}
          title="Best deals worth"
          highlight="grabbing today"
          description="A fast lane of standout offers from the latest catalog. Drag, swipe or use the arrow keys to browse."
        />

        <SliderRail label="Best deals">
          {productList.map((deal, index) => (
            <DealCard
              key={deal._id || deal.uniq_id || index}
              deal={deal}
              onOpen={handleDeals}
              onAddToCart={handleCartClick}
            />
          ))}
        </SliderRail>
      </section>
    </>
  );
}
