"use client";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductLoader from "./ProductLoader";
import NavigationLoader from "./NavigationLoader";
import { StarIcon } from "lucide-react";

const ProductCard = ({ product, showBadge = false, badgeText = "" }) => {
  const router = useRouter();
  const { wishlistItems, removeItem, addToWishlist } = useWishlist();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const inWishlist = wishlistItems?.some(
    (item) => item?.product._id === product._id
  );

  const handleCardClick = () => {
    setIsNavigating(true);
    startTransition(() => {
      router.push(`/product/${product.uniq_id}`).finally(() => {
        setIsNavigating(false);
      });
    });
  };

  const handleHeart = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (inWishlist) {
        await removeItem(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return <ProductLoader />;
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image || "/placeholder-product.jpg"}
          alt={product.product_name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <button
          onClick={handleHeart}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-100 transition-colors"
        >
          <FaHeart
            className={`w-5 h-5 ${
              inWishlist ? "text-red-500 fill-current" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {product.product_name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{product.discounted_price}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{product.original_price}
          </span>
          <span className="text-sm text-green-600 font-medium">
            (
            {Math.round(
              ((product.original_price - product.discounted_price) /
                product.original_price) *
                100
            )}
            % off)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < product.rating ? "fill-current" : "fill-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews_count} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
