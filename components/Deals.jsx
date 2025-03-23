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
      className="hero-section"
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          Our Collections
        </h1>

        <div className="relative w-full h-64 mb-12 overflow-hidden rounded-xl">
          <Image
            src="/summer-banner.jpg"
            alt="summer Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <h2 className="text-3xl font-bold text-white text-center">
              Explore Our Latest Arrivals
            </h2>
          </div>
        </div>

        <BestDealsGrid deals={deals.summerDeals} category="Summer Collection" />
        <BestDealsGrid deals={deals.sportsDeals} category="Sports Gear" />
        <BestDealsGrid
          deals={deals.kitchenDeals}
          category="Kitchen Essentials"
        />
        <BestDealsGrid deals={deals.smartphoneDeals} category="Smartphones" />
        <BestDealsGrid deals={deals.clothesDeals} category="Fashion" />
      </div>
    </motion.div>
  );
}
