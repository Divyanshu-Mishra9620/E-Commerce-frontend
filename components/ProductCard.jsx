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

  return (
    <motion.div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
      layout
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product?.image?.replace(/\s+|[\[\]]/g, "") || "/lamp.jpg"}
          alt={product?.product_name || "Product Image"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleHeartClick}
          disabled={isUpdating}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-red-100 transition-colors disabled:opacity-50"
          aria-label="Toggle Wishlist"
        >
          <FaHeart
            className={`w-5 h-5 transition-colors ${
              inWishlist ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4 space-y-2 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 line-clamp-2 flex-grow">
          {product?.product_name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product?.discounted_price}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{product?.retail_price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
