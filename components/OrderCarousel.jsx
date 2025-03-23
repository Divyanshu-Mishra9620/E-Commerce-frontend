"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useDragScroll } from "@/hooks/useDragScroll";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function OrderCarousel() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const [user, setUser] = useState(null);

  const scrollRef = useDragScroll();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        const response = await fetch(`${BACKEND_URI}/api/orders/${user?._id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setErrorOrders(error.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setErrorReviews(null);
      try {
        const res = await fetch(`${BACKEND_URI}/api/products`);
        const products = await res.json();

        const userReviews = [];
        products?.forEach((prod) => {
          const userReview = prod.reviews?.find(
            (review) => review.user === user._id
          );
          if (userReview) {
            userReviews.push({ ...userReview, product: prod });
          }
        });
        setReviews(userReviews);
      } catch (error) {
        setErrorReviews("Failed to fetch reviews. Please try again.");
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-8">
        Your Orders
      </h2>
      {loadingOrders ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : errorOrders ? (
        <p className="text-red-400 text-center">{errorOrders}</p>
      ) : orders?.length === 0 ? (
        <p className="text-gray-400 text-center">No orders found.</p>
      ) : (
        <Carousel className="w-full max-w-screen-lg">
          <CarouselContent>
            {orders?.map((order, index) => {
              const product = order?.products[0]?.product;
              const reviews = product?.reviews || [];
              const averageRating = calculateAverageRating(reviews);
              const roundedRating = Math.round(averageRating);

              return (
                <CarouselItem key={index} className="w-full flex-shrink-0">
                  <div className="p-2 w-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-800 rounded-xl border border-gray-700 p-4 transition-all"
                    >
                      <div className="w-full h-48 relative rounded-lg overflow-hidden">
                        <Image
                          src={
                            product?.image
                              .replace(/\s+/g, "")
                              .replace(/[\[\]]/g, "") || "/lamp.jpg"
                          }
                          alt={product?.product_name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                      </div>
                      <div className="text-center mt-4">
                        <Link
                          href={`product/${product?.uniq_id}`}
                          className="text-lg font-semibold text-gray-200 hover:text-gray-100 transition"
                        >
                          {product?.product_name}
                        </Link>
                        <div className="mt-2 text-gray-300">
                          <span className="text-xl font-bold">
                            ₹{product?.discounted_price}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          <span>
                            {"⭐".repeat(roundedRating)}
                            {averageRating > 0 && (
                              <span className="text-gray-500">
                                {"☆".repeat(5 - roundedRating)}
                              </span>
                            )}
                          </span>
                          <span className="ml-2">
                            {averageRating.toFixed(1)} ({reviews.length}{" "}
                            reviews)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 transition-all" />
          <CarouselNext className="absolute right-2 bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 transition-all" />
        </Carousel>
      )}

      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mt-12 mb-8">
        Your Reviews
      </h2>
      {loadingReviews ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : errorReviews ? (
        <p className="text-red-400 text-center">{errorReviews}</p>
      ) : reviews?.length === 0 ? (
        <p className="text-gray-400 text-center">No reviews found.</p>
      ) : (
        <div
          ref={scrollRef}
          className="w-full max-w-screen-lg flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory"
        >
          {reviews?.map((review, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="snap-center flex-shrink-0 w-[300px] bg-gray-800 rounded-xl border border-gray-700 p-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <Image
                    src={
                      review.product?.image
                        ?.replace(/\s+/g, "")
                        .replace(/[\[\]]/g, "") || "/lamp.jpg"
                    }
                    alt={review.product?.product_name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-200">
                      {review.product?.product_name}
                    </h3>
                    <Link href={`/product/${review.product?.uniq_id}`}>
                      <Info className="w-5 h-5 text-gray-400 hover:text-gray-200 cursor-pointer" />
                    </Link>
                  </div>
                  <div className="text-yellow-400 text-sm">
                    <span>{"⭐".repeat(review.rating)}</span> {review.rating}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {review.comment || ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
