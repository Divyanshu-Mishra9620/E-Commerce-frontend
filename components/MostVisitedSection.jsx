"use client";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

const MostVisitedSection = ({ products }) => {
  const mostVisitedItems = products
    .filter((product) => product.reviews && product.reviews > 0)
    .slice(0, 10);
  const randomItems =
    mostVisitedItems.length === 0 ? products.slice(0, 10) : mostVisitedItems;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="mt-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Trending Now
            <span className="ml-3 text-red-500">
              <FaFire className="inline-block w-8 h-8" />
            </span>
          </h3>
          <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
            Based on user activity
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {randomItems.map((item, index) => (
            <motion.div
              key={item.uniq_id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                product={item}
                showBadge
                badgeText="Trending"
                badgeColor="bg-gradient-to-r from-red-500 to-orange-400"
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 md:hidden">
          Based on recent user activity
        </div>
      </div>
    </motion.section>
  );
};

export default MostVisitedSection;
