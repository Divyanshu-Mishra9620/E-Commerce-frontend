"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Fashion",
    href: "/categories/fashion",
    image: "/clothes.jpg",
  },
  {
    title: "Home & Living",
    href: "/categories/home-living",
    image: "/utensils.jpg",
  },
  {
    title: "Beauty & Health",
    href: "/categories/beauty-health",
    image: "/beauty.jpg",
  },
  {
    title: "Sports & Outdoors",
    href: "/categories/sports-outdoors",
    image: "/sports.jpg",
  },
  {
    title: "Electronics",
    href: "/categories/electronics",
    image: "/electronics.jpg",
  },
];

const ExploreGrid = () => {
  const router = useRouter();

  const handleCategory = (category, e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(category)}`);
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="hero-section"
  >

    <div
      className="mt-8 p-4 border border-[#b8860b]/30 
           bg-gradient-to-br from-black via-[#2a2108] to-black
           shadow-[0_25px_50px_-12px_rgba(184,134,11,0.25)]"
    >
      <h3
        className="text-3xl font-bold mb-6 px-2 tracking-tighter
             bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent"
      >
        Explore Categories
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square cursor-pointer"
            onClick={(e) => handleCategory(category.title, e)}
          >
            <div
              className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[#b8860b]/30 
                   transition-all group-hover:border-[#b8860b]/60"
            >
              <Image
                src={category.image}
                alt={category.title}
                width={400}
                height={400}
                className="w-full h-full object-cover transform transition-all duration-500 
                       group-hover:scale-105 saturate-90 group-hover:saturate-125"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black via-transparent 
                     to-transparent opacity-90"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <span
                className="text-xl font-bold bg-gradient-to-r from-[#b8860b] to-[#daa520] 
                     bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {category.title}
              </span>
            </div>

            {/* Gold hover overlay */}
            <div
              className="absolute inset-0 bg-[#b8860b]/10 group-hover:bg-[#b8860b]/20 
                   transition-all rounded-xl"
            />
          </motion.div>
        ))}
      </div>
    </div>
      </motion.div>
  );
};

export default ExploreGrid;
