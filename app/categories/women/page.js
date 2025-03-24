"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WomenPage() {
  const router = useRouter();

  const categories = [
    {
      name: "Dresses",
      image: "/dresses.png",
    },
    {
      name: "Tops",
      image: "/tops.png",
    },
    {
      name: "Skirts",
      image: "/skirt.png",
    },
    {
      name: "Bags",
      image: "/bags.png",
    },
    {
      name: "Shoes",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    },
    {
      name: "Activewear",
      image: "/dresses.png",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    const searchQuery = `women ${categoryName}`.toLowerCase();
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
          Women's Collection
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
