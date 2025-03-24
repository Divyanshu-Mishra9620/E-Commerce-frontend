"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function CategoriesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { name: "Men", path: "/categories/men" },
    { name: "Women", path: "/categories/women" },
    { name: "Kids", path: "/categories/kids" },
  ];

  const handleNavigation = (path) => {
    setIsLoading(true);
    setTimeout(() => router.push(path), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1.5,
              }}
            >
              <Image
                src="/categories.gif"
                alt="Loading..."
                width={300}
                height={150}
                priority
                unoptimized
                className="filter grayscale contrast-150"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-20"
          >
            <h1 className="text-4xl font-light text-center mb-16 text-gray-100 tracking-wider">
              Collections
            </h1>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer"
                  onClick={() => handleNavigation(category.path)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <h2 className="text-3xl font-medium text-gray-100 tracking-widest group-hover:scale-110 transition-transform duration-300">
                      {category.name}
                    </h2>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 via-gray-600 to-gray-800 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0.5 border border-gray-600/30 rounded-xl" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
