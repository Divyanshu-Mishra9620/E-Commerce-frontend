"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

const ProductSlide = ({ product, isActive }) => {
  const router = useRouter();

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 md:px-16">
      <motion.div
        key={`${product?.uniq_id}-text`}
        variants={variants}
        initial="hidden"
        animate={isActive ? "visible" : "exit"}
        className="flex flex-col justify-center text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          {product?.product_name}
        </h1>
        <p className="mt-4 text-lg text-slate-700 line-clamp-3">
          {product?.description}
        </p>
        <div className="mt-8 flex gap-4 justify-center md:justify-start">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/product/${product?.uniq_id}`)}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} />
            Shop Now
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        key={`${product?.uniq_id}-image`}
        variants={variants}
        initial="hidden"
        animate={isActive ? "visible" : "exit"}
        className="relative w-full h-64 md:h-96"
      >
        <Image
          src={product?.image?.replace(/\s+|[\[\]]/g, "") || "/images/lamp.jpg"}
          alt={product?.product_name}
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
};

export default function Hero({ products }) {
  const productList = Array.isArray(products) ? products?.slice(0, 5) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productList?.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [productList?.length]);

  const goToSlide = (index) => setCurrentIndex(index);

  if (productList?.length === 0) {
    return null;
  }

  return (
    <section className="w-full relative my-8">
      <div className="relative w-full h-[550px] md:h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden rounded-2xl shadow-lg border border-slate-200">
        <AnimatePresence initial={false}>
          <ProductSlide
            key={currentIndex}
            product={productList[currentIndex]}
            isActive={true}
          />
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {productList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 w-6"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
