"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Sparkles } from "lucide-react";

import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import BestDealsGrid from "./BestDealsGrid";

const dealCategories = {
  summerDeals: {
    title: "Summer Collection",
    keywords: ["summer", "beach", "vacation", "sun"],
    gradient: "from-sky-500 to-brand-500",
  },
  sportsDeals: {
    title: "Sports Gear",
    keywords: ["sports", "fitness", "gym", "athletic"],
    gradient: "from-emerald-500 to-teal-500",
  },
  clothesDeals: {
    title: "Fashion Hub",
    keywords: ["clothing", "fashion", "apparel", "shirt", "jeans"],
    gradient: "from-fuchsia-500 to-coral-500",
  },
  smartphoneDeals: {
    title: "Mobile Zone",
    keywords: ["smartphone", "mobile", "android", "iphone"],
    gradient: "from-brand-600 to-fuchsia-500",
  },
  kitchenDeals: {
    title: "Kitchen Essentials",
    keywords: ["kitchen", "cooking", "appliance", "cookware"],
    gradient: "from-amber-500 to-coral-500",
  },
};

export default function Deals({ products }) {
  const reduceMotion = useReducedMotion();
  const bannerRef = useRef(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const deals = useMemo(() => {
    if (!Array.isArray(products)) return {};

    const categorizedDeals = {};
    const categories = Object.keys(dealCategories);

    for (const key of categories) {
      categorizedDeals[key] = [];
    }

    for (const product of products) {
      const searchableText =
        `${product.product_name} ${product.description} ${product.category}`.toLowerCase();

      for (const key of categories) {
        if (
          categorizedDeals[key].length < 10 &&
          dealCategories[key].keywords.some((keyword) =>
            searchableText.includes(keyword)
          )
        ) {
          categorizedDeals[key].push(product);
        }
      }
    }

    return categorizedDeals;
  }, [products]);

  const availableCollections = Object.entries(deals).filter(
    ([, collection]) => collection.length > 0
  );

  const activeKey = availableCollections.some(([key]) => key === selectedKey)
    ? selectedKey
    : availableCollections[0]?.[0];
  const activeDeals = deals[activeKey] || [];

  return (
    <section
      id="collections"
      className="storefront-section scroll-mt-32 py-12 md:py-16"
    >
      {/* Parallax banner */}
      <div
        ref={bannerRef}
        className="relative isolate flex min-h-[24rem] items-end overflow-hidden rounded-[2rem] ring-1 ring-black/5 sm:rounded-[2.5rem] md:min-h-[28rem] dark:ring-white/10"
      >
        <motion.div
          style={reduceMotion ? undefined : { y: imageY }}
          className="absolute inset-x-0 -inset-y-[12%] -z-10"
        >
          <Image
            src="/summer-banner.jpg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 80rem"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#0b0a14]/95 via-brand-900/65 to-coral-600/25" />
        <div className="bg-grid mask-radial absolute inset-0 -z-10 opacity-30" />

        <motion.div
          style={reduceMotion ? undefined : { y: copyY }}
          className="max-w-2xl p-7 sm:p-10 lg:p-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff]/85 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-coral-300" />
            Seasonal edit
          </span>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-[#fff] md:text-6xl">
            Curated collections for{" "}
            <span className="bg-gradient-to-r from-brand-200 via-fuchsia-200 to-coral-300 bg-clip-text text-transparent">
              every mood
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#fff]/70">
            Fresh arrivals, crowd favourites and category picks, sorted into
            lanes you can flick through in seconds.
          </p>
        </motion.div>
      </div>

      {availableCollections.length === 0 ? (
        <div className="storefront-empty mt-10 px-6 py-12 text-center text-slate-500">
          Collections will appear here as products are added.
        </div>
      ) : (
        <div className="mt-10">
          <div
            role="tablist"
            aria-label="Collections"
            className="storefront-panel-soft scrollbar-hide mb-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full p-1.5"
          >
            {availableCollections.map(([key, collection]) => {
              const isActive = key === activeKey;

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="collection-panel"
                  onClick={() => setSelectedKey(key)}
                  className="relative shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold sm:px-5"
                >
                  {isActive && (
                    <motion.span
                      layoutId="collection-tab-indicator"
                      className="absolute inset-0 rounded-full bg-[#0f0d1f] shadow-lg shadow-brand-900/20 dark:bg-[#f0eeff]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex items-center gap-2 whitespace-nowrap transition-colors duration-300",
                      isActive
                        ? "text-[#fff] dark:text-[#0f0d1f]"
                        : "text-slate-500 hover:text-slate-950"
                    )}
                  >
                    {dealCategories[key].title}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                        isActive
                          ? "bg-white/15 dark:bg-black/10"
                          : "bg-slate-900/5 dark:bg-white/10"
                      )}
                    >
                      {collection.length}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeKey}
              id="collection-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            >
              <BestDealsGrid
                deals={activeDeals}
                category={dealCategories[activeKey].title}
                gradient={dealCategories[activeKey].gradient}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
