"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function MenPage() {
  const router = useRouter();

  const categories = [
    {
      name: "Shirts",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
      description: "Premium shirts for every occasion",
    },
    {
      name: "Trousers",
      image: "/trouser.png",
      description: "Tailored fits for maximum comfort",
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a",
      description: "Complete your look with our accessories",
    },
    {
      name: "Jeans",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      description: "Durable denim in modern cuts",
    },
    {
      name: "Shoes",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
      description: "Footwear that combines style and comfort",
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      description: "Performance wear for active lifestyles",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    const searchQuery = `men ${categoryName}`.toLowerCase();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16 sm:py-24"
      >
        <div className="text-center mb-16">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight"
          >
            Men's Collection
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Premium quality clothing designed for the modern man
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60 z-10" />

              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3} 
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h2 className="text-2xl font-semibold text-white mb-1">
                  {category.name}
                </h2>
                <p className="text-gray-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                <div className="flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                  <span className="text-sm font-medium">Shop Now</span>
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              <div className="absolute inset-0.5 border border-white/10 rounded-xl group-hover:border-white/30 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <button
            className="px-8 py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 flex items-center mx-auto"
            onClick={() => router.push("/")}
          >
            Explore Full Collection
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
