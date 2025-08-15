"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import Spinner from "./Spinner";

const categories = [
  {
    title: "Fashion",
    href: "/categories/fashion",
    image: "/clothes.jpg",
    description: "Trendy apparel for all occasions",
    color: "bg-indigo-100 dark:bg-indigo-900/50",
  },
  {
    title: "Home & Living",
    href: "/categories/home-living",
    image: "/utensils.jpg",
    description: "Everything for your home",
    color: "bg-amber-100 dark:bg-amber-900/50",
  },
  {
    title: "Beauty & Health",
    href: "/categories/beauty-health",
    image: "/beauty.jpg",
    description: "Self-care essentials",
    color: "bg-pink-100 dark:bg-pink-900/50",
  },
  {
    title: "Sports & Outdoors",
    href: "/categories/sports-outdoors",
    image: "/sports.jpg",
    description: "Gear for active lifestyles",
    color: "bg-emerald-100 dark:bg-emerald-900/50",
  },
  {
    title: "Electronics",
    href: "/categories/electronics",
    image: "/electronics.jpg",
    description: "Cutting-edge tech",
    color: "bg-blue-100 dark:bg-blue-900/50",
  },
];

const ExploreGrid = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleCategory = (category, e) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(category)}`);
    });
  };

  if (isPending) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Spinner size="lg" className="text-blue-500" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Shop by Category
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Discover products across our carefully curated categories
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`absolute inset-0 rounded-2xl ${
                category.color
              } transition-all duration-300 ${
                hoveredIndex === index ? "opacity-100" : "opacity-50"
              }`}
            />

            <div
              className={`relative h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 ${
                hoveredIndex === index
                  ? "ring-2 ring-primary-500 scale-[1.02]"
                  : ""
              }`}
              onClick={(e) => handleCategory(category.title, e)}
            >
              <div className="aspect-square relative">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  quality={90}
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <motion.h3
                  className="text-xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {category.title}
                </motion.h3>
                <motion.p
                  className="text-gray-200 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {category.description}
                </motion.p>
                <motion.button
                  className="mt-3 w-full py-2 bg-white/90 text-gray-900 font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ExploreGrid;
