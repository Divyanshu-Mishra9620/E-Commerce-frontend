"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

import {
  formatCurrency,
  getDisplayPrices,
  RUPEE_SYMBOL,
  sanitizeProductImage,
} from "@/lib/product-display";

const ProductSlide = ({ product, isActive, index, totalSlides }) => {
  const router = useRouter();
  const { salePrice, originalPrice } = getDisplayPrices(product);

  const variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -40,
      transition: { duration: 0.35, ease: "easeIn" },
    },
  };

  return (
    <div className="absolute inset-0 grid grid-cols-1 items-center gap-10 px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-12 md:py-12 lg:px-16">
      <motion.div
        key={`${product?.uniq_id}-text`}
        variants={variants}
        initial="hidden"
        animate={isActive ? "visible" : "exit"}
        className="relative z-10 flex flex-col justify-center text-center md:text-left"
      >
        <span className="storefront-kicker mx-auto md:mx-0">
          <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-amber-300" />
          Featured Find
        </span>

        <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
          {product?.product_name}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:mx-0 md:text-lg">
          {product?.description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
          <button
            type="button"
            onClick={() => router.push(`/product/${product?.uniq_id}`)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
          >
            <ShoppingBag size={18} />
            Shop Now
          </button>

          <div className="storefront-chip justify-center">
            <span className="text-slate-400">Offer</span>
            <span className="font-semibold text-slate-900">
              {RUPEE_SYMBOL}
              {formatCurrency(salePrice)}
            </span>
            {originalPrice > salePrice && (
              <span className="text-slate-400 line-through">
                {RUPEE_SYMBOL}
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((item) => (
              <span
                key={item}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-cyan-100 text-xs font-semibold text-slate-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              >
                {item + 1}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            Slide {index + 1} of {totalSlides}
          </p>
        </div>
      </motion.div>

      <motion.div
        key={`${product?.uniq_id}-image`}
        variants={variants}
        initial="hidden"
        animate={isActive ? "visible" : "exit"}
        className="relative z-10 h-[19rem] md:h-[26rem]"
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-100/70 via-white to-cyan-50 blur-2xl dark:bg-stone-900/45" />
        <div className="absolute inset-0 rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-sm dark:border-stone-700/60 dark:bg-stone-900/30" />
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] p-6">
          <Image
            src={sanitizeProductImage(product?.image)}
            alt={product?.product_name || "Featured product"}
            fill
            className="object-contain p-6 drop-shadow-[0_30px_35px_rgba(15,23,42,0.22)]"
            priority
          />
        </div>

        <div className="absolute bottom-4 right-4 rounded-[1.25rem] border border-white/70 bg-white/90 px-4 py-3 shadow-xl shadow-slate-200/60 backdrop-blur-sm dark:border-stone-700/70 dark:bg-stone-900/85 dark:shadow-black/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quick View
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-900">
            Discover details <ArrowRight className="h-4 w-4 text-blue-500 dark:text-amber-300" />
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function Hero({ products }) {
  const productList = Array.isArray(products) ? products.slice(0, 5) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (productList.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % productList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [productList.length]);

  if (productList.length === 0) {
    return null;
  }

  return (
    <section className="storefront-section py-8">
      <div className="storefront-panel relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.14),transparent_30%)] dark:bg-none" />
        <div className="absolute left-8 top-6 h-28 w-28 rounded-full bg-blue-200/35 blur-3xl dark:bg-stone-700/10" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl dark:bg-stone-700/10" />

        <div className="relative min-h-[37rem] md:min-h-[32rem]">
          <AnimatePresence initial={false} mode="wait">
            <ProductSlide
              key={productList[currentIndex]?.uniq_id || currentIndex}
              product={productList[currentIndex]}
              isActive={true}
              index={currentIndex}
              totalSlides={productList.length}
            />
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-2 shadow-lg shadow-slate-200/70 backdrop-blur-sm">
          {productList.map((product, index) => (
            <button
              key={product?.uniq_id || index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-slate-950 dark:bg-amber-300"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-stone-600 dark:hover:bg-stone-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
