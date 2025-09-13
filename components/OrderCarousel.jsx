"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useUserReviews } from "@/hooks/useUserReviews";
import { Info, Star } from "lucide-react";

const OrderCard = ({ order }) => {
  const primaryProduct = order.products?.[0]?.product;
  const imageUrl = primaryProduct?.image
    ? primaryProduct.image.replace(/\s+/g, "").replace(/[\[\]]/g, "")
    : "/images/lamp.jpg";
  const orderStatus = order.status || "Processing";

  return (
    // Changed: Replaced CarouselItem with a div that has sizing and flex properties
    <div className="flex-shrink-0 w-[350px]">
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-card rounded-lg border border-border p-4 space-y-3 hover:shadow-md transition-shadow h-full"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
            <Image
              src={imageUrl}
              alt={primaryProduct?.product_name || "Product image"}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/product/${primaryProduct?.uniq_id}`}
              className="focus:outline-none"
            >
              <h3 className="font-medium text-foreground hover:text-primary line-clamp-2 transition-colors">
                {primaryProduct?.product_name}
              </h3>
            </Link>
            <p className="text-lg font-semibold text-primary mt-1">
              ₹{order.totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Order Status:{" "}
          <span className="font-medium text-foreground">{orderStatus}</span>
        </div>
      </motion.div>
    </div>
  );
};

const StarRating = ({ rating = 0 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ))}
  </div>
);

export function ReviewCard({ review }) {
  const product = review?.product;

  if (!product) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="snap-center flex-shrink-0 w-[340px] bg-white rounded-xl border border-gray-200 p-4 transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
          <Image
            src={product.image?.replace(/\s+|[\[\]]/g, "") || "/lamp.jpg"}
            alt={product.product_name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <Link href={`/product/${product.uniq_id}`}>
            <h3 className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 leading-snug">
              {product.product_name}
            </h3>
          </Link>
        </div>
        <Link href={`/product/${product.uniq_id}`} className="shrink-0">
          <Info className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </Link>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between items-center">
          <StarRating rating={product.reviews[0].rating} />
          <p className="text-xs text-gray-500">
            {new Date(product.reviews[0].createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            ) ||
              new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
          </p>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {product.reviews[0].comment || "No comment provided."}
        </p>
      </div>
    </motion.div>
  );
}

export default function OrderCarousel() {
  const {
    orders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useUserOrders();

  const {
    reviews,
    isLoading: loadingReviews,
    error: errorReviews,
  } = useUserReviews();

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-16">
      <div>
        {loadingOrders ? (
          <Spinner className="text-blue-500" />
        ) : errorOrders ? (
          <p className="text-red-400 text-center">Failed to load orders.</p>
        ) : orders?.length === 0 ? (
          <p className="text-gray-400 text-center">No orders found.</p>
        ) : (
          // Changed: Replaced Carousel with a scrollable div
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {orders?.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Reviews</h2>
        {loadingReviews ? (
          <Spinner className="text-blue-500" />
        ) : errorReviews ? (
          <p className="text-red-400 text-center">Failed to load reviews.</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-center">
            You haven't written any reviews yet.
          </p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {reviews?.map((review) => (
              <ReviewCard key={review?._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
