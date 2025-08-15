"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useDragScroll } from "@/hooks/useDragScroll";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import Spinner from "./Spinner";
import { useAuth } from "@/hooks/useAuth";
import CyberLoader from "./CyberLoader";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const BestDealsGrid = ({ products }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const productList = Array.isArray(products) ? products : [];
  const { setCartItems } = useCart();
  const [isPending, startTransition] = useTransition();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <CyberLoader />
      </div>
    );
  }

  useDragScroll(scrollRef);

  async function handleCartClick(deal, e) {
    e.stopPropagation();
    try {
      if (!user?._id) {
        router.push("/api/auth/signin");
        toast.error("Please sign in to add items to cart");
        return;
      }

      const userCarts = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = userCarts?.cart?.items?.find(
        (item) => item.product === deal._id
      );

      const loadingToast = toast.loading("Adding to cart...");

      const response = await fetch(`${BACKEND_URI}/api/cart/${user?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: deal._id,
          quantity: existingItem ? existingItem.quantity + 1 : 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const updatedCart = await response.json();
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart.cart.items);

      toast.success("Item added to cart!", {
        id: loadingToast,
        icon: "🛒",
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart!", {
        id: loadingToast,
        position: "bottom-right",
      });
    }
  }

  const handleDeals = (uniq_id) => {
    startTransition(() => {
      router.push(`/product/${uniq_id}`);
    });
  };

  if (isPending) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Best Deals
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Limited-time offers on our most popular products
        </motion.p>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide snap-x snap-mandatory"
      >
        {productList.map((deal, index) => (
          <motion.div
            key={index}
            className="snap-center flex-shrink-0 w-[300px] sm:w-[320px] relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <motion.div
              className={`h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden ${
                hoveredCard === index ? "ring-2 ring-primary-500" : ""
              }`}
              whileHover={{ y: -5 }}
              onClick={() => handleDeals(deal.uniq_id)}
            >
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg z-10">
                {Math.round(
                  (200 /
                    ((isNaN(+deal.discounted_price)
                      ? 599
                      : +deal.discounted_price) +
                      200)) *
                    100
                )}
                % OFF
              </div>

              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={
                    deal.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                    "/product-placeholder.jpg"
                  }
                  alt={deal.product_name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500"
                  style={{
                    transform:
                      hoveredCard === index ? "scale(1.05)" : "scale(1)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {deal.product_name}
                </h4>

                <div className="flex items-baseline gap-3 mt-auto">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{+deal.discounted_price?.toLocaleString() || "8,999"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ₹
                    {(isNaN(+deal.discounted_price)
                      ? 599
                      : +deal.discounted_price + 200
                    )?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < (deal.reviews?.rating || 0)
                              ? "fill-current"
                              : "fill-gray-300 dark:fill-gray-600"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({deal.reviews?.count || 0})
                    </span>
                  </div>

                  <motion.button
                    className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleCartClick(deal, e)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BestDealsGrid;
