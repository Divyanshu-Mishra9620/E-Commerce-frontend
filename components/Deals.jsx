"use client";
import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import BestDealsGrid from "./BestDealsGrid";

const dealCategories = {
  summerDeals: {
    title: "Summer Collection",
    keywords: ["summer", "beach", "vacation", "sun"],
    gradient: "from-blue-400 to-cyan-500",
  },
  sportsDeals: {
    title: "Sports Gear",
    keywords: ["sports", "fitness", "gym", "athletic"],
    gradient: "from-green-400 to-emerald-600",
  },
  clothesDeals: {
    title: "Fashion Hub",
    keywords: ["clothing", "fashion", "apparel", "shirt", "jeans"],
    gradient: "from-pink-400 to-rose-600",
  },
  smartphoneDeals: {
    title: "Mobile Zone",
    keywords: ["smartphone", "mobile", "android", "iphone"],
    gradient: "from-purple-400 to-indigo-600",
  },
  kitchenDeals: {
    title: "Kitchen Essentials",
    keywords: ["kitchen", "cooking", "appliance", "cookware"],
    gradient: "from-orange-400 to-red-500",
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
        if (categorizedDeals[key].length < 10) {
          if (
            dealCategories[key].keywords.some((keyword) =>
              searchableText.includes(keyword)
            )
          ) {
            categorizedDeals[key].push(product);
          }
        }
      }
    }
    return categorizedDeals;
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative aspect-[16/6] mb-16 overflow-hidden rounded-2xl shadow-lg border border-slate-200">
          <Image
            src="/summer-banner.jpg"
            alt="New Season Arrivals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-700/50 flex items-center p-8 md:p-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                New Season Arrivals
              </h2>
              <p className="mt-2 text-xl text-blue-100">
                Discover Our Curated Collections
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {Object.entries(deals).map(([key, dealList]) => (
            <BestDealsGrid
              key={key}
              deals={dealList}
              category={dealCategories[key].title}
              gradient={dealCategories[key].gradient}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
