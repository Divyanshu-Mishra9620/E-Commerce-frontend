"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useTransition } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useDragScroll } from "@/hooks/useDragScroll";
import "@/app/_styles/global.css";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import Spinner from "./Spinner";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const BestDealsGrid = ({ products }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const productList = Array.isArray(products) ? products : [];
  const { setCartItems } = useCart();
  const [isPending, startTransition] = useTransition();
  useDragScroll(scrollRef);

  async function handleCartClick(deal, e) {
    e.stopPropagation();
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        router.push("/api/auth/signin");
        return;
      }

      const userCarts = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log(userCarts);

      const existingItem = userCarts?.cart?.items?.find(
        (item) => item.product === deal._id
      );

      const loadingToast = toast.loading("Adding to cart...");

      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser._id}`, {
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
      console.log(updatedCart.cart);

      setCartItems(updatedCart.cart.items);
      console.log(updatedCart.cart);

      toast.success("Item added to cart!", { id: loadingToast });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart!", { id: loadingToast });
    }
  }

  const handleDeals = (uniq_id) => {
    startTransition(() => {
      router.push(`/product/${uniq_id}`);
    });
  };

  if (isPending) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hero-section"
    >
      <div
        className="mt-8 p-6 border border-gold-500/20 
      bg-gradient-to-br from-black via-[#0f0e09] to-black
      shadow-[0_25px_50px_-12px_rgba(184,134,11,0.25)] relative
      overflow-hidden group"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.jpeg')] mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

        <div className="flex justify-between items-center mb-6 px-2 relative z-10">
          <h3
            className="text-3xl font-bold tracking-tighter 
              bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 
              bg-clip-text text-transparent font-serif"
          >
            Curated Luxury
          </h3>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide 
        snap-x snap-mandatory relative z-10"
        >
          {productList.slice(20, 32).map((deal, index) => (
            <motion.div
              key={index}
              className="snap-center flex-shrink-0 w-[320px] relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring" }}
            >
              <div
                className="h-full bg-gradient-to-br from-black via-[#161510] to-[#0a0906] 
                rounded-xl border border-gold-500/20 hover:border-gold-500/40
                p-1.5 shadow-2xl transition-all duration-500 hover:shadow-gold-500/30
                flex flex-col transform hover:-translate-y-1.5 relative hover:cursor-pointer"
                onClick={() => handleDeals(deal.uniq_id)}
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                  transition-opacity bg-gradient-to-br from-gold-500/10 via-transparent to-transparent"
                />

                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={
                      deal.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                      "/lamp.jpg"
                    }
                    alt={deal.product_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 
                    group-hover:scale-105 saturate-90 group-hover:saturate-110 "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div
                    className="absolute top-4 left-4 bg-gradient-to-br from-gold-500 to-gold-400 
                    text-black px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wider 
                    shadow-lg flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                  </div>

                  <div
                    className={`absolute top-0 -right-8 w-32 bg-gold-500 text-black py-2 
    text-center rotate-45 translate-y-2 font-bold text-xs uppercase 
    tracking-wider shadow-xl`}
                  >
                    {Math.round(
                      (200 / ((+deal.discounted_price || 7999) + 200)) * 100
                    )}
                    % OFF
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4
                      className="text-lg font-semibold text-gray-100 truncate 
                      font-serif tracking-tight"
                    >
                      {deal.product_name}
                    </h4>

                    <div className="flex items-baseline gap-3 mt-2">
                      <span
                        className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-300 
                        bg-clip-text text-transparent font-mono"
                      >
                        ₹{+deal.discounted_price || "8999"}
                      </span>
                      <span className="text-sm text-gray-400 line-through font-medium">
                        ₹{+deal.discounted_price + 200 || "9999"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex text-gold-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < (deal.reviews?.rating || 0)
                                ? "fill-current"
                                : "fill-gray-700/50"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 font-medium">
                        ({deal.reviews?.count || 0})
                      </span>
                    </div>

                    <button
                      className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 
              transition-colors border border-gold-500/30 hover:border-gold-500/50 z-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCartClick(deal, e);
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-gold-400"
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
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BestDealsGrid;
