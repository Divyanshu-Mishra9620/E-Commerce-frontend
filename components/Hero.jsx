"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ProductCard = ({ image, product_name, discounted_price, uniq_id }) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-lg p-8 flex flex-col items-center justify-center group",
        "text-white bg-gradient-to-b from-[#000000] to-[#1B1B1B] shadow-2xl hover:shadow-3xl transition-all duration-500",
        "backdrop-blur-lg backdrop-filter bg-opacity-20 border border-gray-700 hover:border-gray-500"
      )}
    >
      <img
        src={image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") || "/lamp.jpg"}
        alt={product_name || "Product Image"}
        className="w-60 h-60 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 cursor-pointer"
        onClick={() => router.push(`/product/${uniq_id}`)}
      />
      <div className="text-center mt-6">
        <h3 className="text-2xl font-serif font-semibold group-hover:text-gold-500">
          {product_name || "Unnamed Product"}
        </h3>
        <p className="text-3xl font-bold mt-2 group-hover:text-gold-400">
          ₹{discounted_price || "0.00"}
        </p>
      </div>
    </div>
  );
};

export default function Hero({ products }) {
  const productList = Array.isArray(products) ? products.slice(0, 20) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % productList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [productList.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hero-section"
    >
      <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-[#1B1B1B] via-[#000000] to-[#1B1B1B]">
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {productList.map((product, index) => (
            <div
              key={product._id}
              className="w-full h-full flex-shrink-0 flex items-center justify-center"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {productList.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gold-500 scale-125"
                  : "bg-gray-500 hover:bg-gold-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
