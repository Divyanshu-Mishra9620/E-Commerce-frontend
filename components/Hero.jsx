"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Spinner from "./Spinner";

const ProductCard = ({
  image,
  product_name,
  discounted_price,
  uniq_id,
  original_price,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    startTransition(() => {
      router.push(`/product/${uniq_id}`);
    });
  };

  if (isPending) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-2xl">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-between",
        "bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300",
        "border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400",
        "cursor-pointer group"
      )}
      onClick={handleClick}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
        <Image
          src={
            image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
            "/placeholder-product.jpg"
          }
          alt={product_name || "Product Image"}
          fill
          className={cn(
            "object-contain transition-all duration-500 ease-in-out",
            isHovered ? "scale-105" : "scale-100"
          )}
          priority={true}
        />
        {original_price && discounted_price < original_price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(
              ((original_price - discounted_price) / original_price) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      <div className="w-full mt-4 space-y-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
          {product_name || "Unnamed Product"}
        </h3>

        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
            ₹{discounted_price?.toLocaleString() || "0.00"}
          </p>
          {original_price && discounted_price < original_price && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ₹{original_price?.toLocaleString()}
            </p>
          )}
        </div>

        <button
          className="w-full mt-2 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default function Hero({ products }) {
  const productList = Array.isArray(products) ? products.slice(0, 8) : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    let interval;
    if (autoPlay && productList.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % productList.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, productList.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productList.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + productList.length) % productList.length
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full relative"
    >
      <div className="relative w-full h-[500px] bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden rounded-2xl shadow-md">
        {productList.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Previous product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Next product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out">
          {productList.map((product, index) => (
            <div
              key={product._id}
              className="w-full h-full flex-shrink-0 flex items-center justify-center p-12"
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col justify-center space-y-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                  >
                    {product.product_name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    {product.description ||
                      "Premium quality product with exceptional features."}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-4"
                  >
                    <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
                      Shop Now
                    </button>
                    <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      Learn More
                    </button>
                  </motion.div>
                </div>
                <div className="flex items-center justify-center">
                  <ProductCard {...product} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {productList.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {productList.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary-600 w-6"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 p-4">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
