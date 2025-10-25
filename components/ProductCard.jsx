"use client";

import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { isItemInWishlist, removeItem, addToWishlist } = useWishlist();

  const [isUpdating, setIsUpdating] = useState(false);

  const inWishlist = isItemInWishlist(product?._id);

  const handleCardClick = () => {
    router.push(`/product/${product?.uniq_id}`);
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (inWishlist) {
        await removeItem(product?._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setIsUpdating(false);
    }
  };

  const discountPercent =
    product?.retail_price && product?.discounted_price
      ? Math.round(
          ((product.retail_price - product.discounted_price) /
            product.retail_price) *
            100
        )
      : 0;

  return (
    <motion.div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-slate-100 hover:border-blue-300"
      layout
      whileHover={{ translateY: -4 }}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <Image
          src={product?.image?.replace(/\s+|[\[\]]/g, "") || "/lamp.jpg"}
          alt={product?.product_name || "Product Image"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {discountPercent}% OFF
          </div>
        )}

        <button
          onClick={handleHeartClick}
          disabled={isUpdating}
          className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-emerald-50 transition-all duration-200 hover:scale-110 disabled:opacity-50 border border-slate-100"
          aria-label="Toggle Wishlist"
        >
          <FaHeart
            className={`w-5 h-5 transition-all duration-200 ${
              inWishlist ? "text-emerald-500 scale-125" : "text-slate-300"
            }`}
          />
        </button>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="p-4 space-y-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-slate-900 line-clamp-2 flex-grow text-sm leading-snug group-hover:text-blue-600 transition-colors duration-200">
          {product?.product_name}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">(120)</span>
        </div>

        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent" />

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-bold text-blue-600">
            ₹{product?.discounted_price?.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-slate-500 line-through">
            ₹{product?.retail_price?.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="text-xs font-medium text-emerald-600 mt-auto">
          ✓ In Stock
        </div>
      </div>

      <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-transparent border-t border-slate-100 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        View Details →
      </div>
    </motion.div>
  );
};

export default ProductCard;
