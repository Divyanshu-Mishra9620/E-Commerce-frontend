import Image from "next/image";
import { useEffect, useState } from "react";
import BestDealsGrid from "./BestDealsGrid";
import { motion } from "framer-motion";

export default function Deals({ products }) {
  const [deals, setDeals] = useState({
    summerDeals: [],
    sportsDeals: [],
    clothesDeals: [],
    smartphoneDeals: [],
    kitchenDeals: [],
  });

  const productList = Array.isArray(products) ? products : [];

  useEffect(() => {
    if (productList) {
      setDeals({
        summerDeals: productList
          .filter((product) =>
            ["summer", "beach", "vacation", "sun", "holiday"].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        sportsDeals: productList
          .filter((product) =>
            [
              "sports",
              "fitness",
              "gym",
              "outdoor",
              "athletic",
              "football",
              "cricket",
              "basketball",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        clothesDeals: productList
          .filter((product) =>
            [
              "clothing",
              "fashion",
              "apparel",
              "shirt",
              "jeans",
              "dress",
              "sneakers",
              "jacket",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        smartphoneDeals: productList
          .filter((product) =>
            [
              "smartphone",
              "mobile",
              "android",
              "iphone",
              "5g",
              "cellphone",
              "apple",
              "samsung",
              "oneplus",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        kitchenDeals: productList
          .filter((product) =>
            [
              "kitchen",
              "cooking",
              "appliance",
              "mixer",
              "grinder",
              "blender",
              "microwave",
              "oven",
              "utensil",
              "cookware",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),
      });
    }
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative aspect-[3/1] mb-16 overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/summer-banner.jpg"
            alt="Summer Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20">
            <div className="flex h-full items-center pl-8 md:pl-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                New Season Arrivals
                <span className="block mt-2 text-xl font-light text-gray-200 sm:text-2xl">
                  Discover Our Curated Collections
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="space-y-12">
          <BestDealsGrid
            deals={deals.summerDeals}
            category="Summer Collection"
            gradient="from-blue-400 to-cyan-500"
          />
          <BestDealsGrid
            deals={deals.sportsDeals}
            category="Sports Gear"
            gradient="from-green-400 to-emerald-600"
          />
          <BestDealsGrid
            deals={deals.kitchenDeals}
            category="Kitchen Essentials"
            gradient="from-orange-400 to-red-500"
          />
          <BestDealsGrid
            deals={deals.smartphoneDeals}
            category="Smartphones"
            gradient="from-purple-400 to-indigo-600"
          />
          <BestDealsGrid
            deals={deals.clothesDeals}
            category="Fashion"
            gradient="from-pink-400 to-rose-600"
          />
        </div>
      </div>
    </motion.div>
  );
}
