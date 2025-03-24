"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MenPage() {
  const router = useRouter();

  const categories = [
    {
      name: "Shirts",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
    },
    {
      name: "Trousers",
      image: "/trouser.png",
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a",
    },
    {
      name: "Jeans",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    },
    {
      name: "Shoes",
      image:
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    const searchQuery = `men ${categoryName}`.toLowerCase();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-28"
      >
        <h1 className="text-4xl font-light text-center mb-16 text-gray-100 tracking-widest">
          Men's Collection
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h2 className="text-3xl font-medium text-gray-100 tracking-widest group-hover:scale-110 transition-transform duration-300">
                  {category.name}
                </h2>
              </div>

              <div className="absolute inset-0.5 border border-gray-600/30 rounded-xl group-hover:border-gray-400/50 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 via-gray-600 to-gray-800 opacity-90 group-hover:opacity-0 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <button
            className="px-8 py-3 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-400 hover:text-white transition-all duration-300"
            onClick={() => router.push("/")}
          >
            Explore Full Collection
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
