"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function WomenPage() {
  const router = useRouter();

  const categories = [
    {
      name: "Dresses",
      image: "/dresses.png",
      description: "Elegant styles for every occasion",
    },
    {
      name: "Tops",
      image: "/tops.png",
      description: "Trendy tops for effortless style",
    },
    {
      name: "Skirts",
      image: "/skirt.png",
      description: "Flattering silhouettes for all seasons",
    },
    {
      name: "Bags",
      image: "/bags.png",
      description: "Statement pieces to complete your look",
    },
    {
      name: "Shoes",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      description: "Footwear that combines comfort and fashion",
    },
    {
      name: "Activewear",
      image: "/dresses.png",
      description: "Performance fabrics for active lifestyles",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    const searchQuery = `women ${categoryName}`.toLowerCase();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16 sm:py-24"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight"
          >
            Women's Collection
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover curated styles that celebrate femininity and confidence
          </motion.p>
        </div>

        {/* Categories Grid */}
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
                priority={index < 3} // Prioritize loading first 3 images
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <button
            className="px-8 py-3.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-all duration-300 flex items-center mx-auto"
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
