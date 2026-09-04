"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Layers3, Sparkles } from "lucide-react";

import BestDealsGrid from "./BestDealsGrid";

const dealCategories = {
  summerDeals: {
    title: "Summer Collection",
    keywords: ["summer", "beach", "vacation", "sun"],
    gradient: "from-sky-500 to-cyan-500",
  },
  sportsDeals: {
    title: "Sports Gear",
    keywords: ["sports", "fitness", "gym", "athletic"],
    gradient: "from-emerald-500 to-lime-500",
  },
  clothesDeals: {
    title: "Fashion Hub",
    keywords: ["clothing", "fashion", "apparel", "shirt", "jeans"],
    gradient: "from-rose-500 to-orange-400",
  },
  smartphoneDeals: {
    title: "Mobile Zone",
    keywords: ["smartphone", "mobile", "android", "iphone"],
    gradient: "from-blue-600 to-cyan-500",
  },
  kitchenDeals: {
    title: "Kitchen Essentials",
    keywords: ["kitchen", "cooking", "appliance", "cookware"],
    gradient: "from-amber-500 to-orange-500",
  },
};

export default function Deals({ products }) {
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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="storefront-section py-12"
    >
      <div className="storefront-panel overflow-hidden">
        <div className="relative aspect-[16/8] md:aspect-[16/6] overflow-hidden">
          <Image
            src="/summer-banner.jpg"
            alt="New Season Arrivals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-blue-900/65 to-cyan-600/45" />

          <div className="absolute inset-0 flex items-center p-6 md:p-10 lg:p-14">
            <div className="max-w-2xl">
              <span className="storefront-kicker border-white/20 bg-white/10 text-blue-50">
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                Seasonal Edit
              </span>

              <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
                Shop Curated Collections for Every Mood
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-blue-50/85">
                Fresh arrivals, crowd favorites, and category-based picks laid
                out in easy-to-browse rows.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-sm">
                  {availableCollections.length} curated lanes
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-sm">
                  New season spotlight
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12 px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="storefront-kicker">
                <Layers3 className="h-3.5 w-3.5 text-blue-500" />
                Browse By Theme
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Collections worth exploring next
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Each row is tailored from the catalog so you can jump straight
              into the categories that match what you are shopping for.
            </p>
          </div>

          {availableCollections.length === 0 ? (
            <div className="storefront-empty px-6 py-12 text-center text-slate-500">
              Collections will appear here as products are added.
            </div>
          ) : (
            <div className="space-y-12">
              {availableCollections.map(([key, dealList]) => (
                <BestDealsGrid
                  key={key}
                  deals={dealList}
                  category={dealCategories[key].title}
                  gradient={dealCategories[key].gradient}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
