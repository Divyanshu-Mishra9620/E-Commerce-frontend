"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    {
      name: "Men",
      path: "/categories/men",
      description: "Sophisticated styles for the modern man",
      bgColor: "bg-blue-900/20",
    },
    {
      name: "Women",
      path: "/categories/women",
      description: "Elegant collections for every occasion",
      bgColor: "bg-rose-900/20",
    },
    {
      name: "Kids",
      path: "/categories/kids",
      description: "Playful designs for little ones",
      bgColor: "bg-emerald-900/20",
    },
  ];

  const handleNavigation = (path) => {
    setIsLoading(true);
    setTimeout(() => router.push(path), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-1 bg-gray-200 rounded-full max-w-md"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                className="h-full bg-gray-800 rounded-full"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16 sm:py-24"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                Our Collections
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover premium quality across all categories
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${category.bgColor}`}
                  onClick={() => handleNavigation(category.path)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60 z-10" />

                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 z-20 text-center">
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    <div className="flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-medium">Explore</span>
                      <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className="absolute inset-0.5 border border-white/10 rounded-xl group-hover:border-white/30 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
