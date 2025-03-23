"use client";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ProductCard = ({ product, showBadge = false, badgeText = "" }) => {
  const router = useRouter();
  const { wishlistItems, removeItem, addToWishlist } = useWishlist();

  const [isUpdating, setIsUpdating] = useState(false);

  const inWishlist = wishlistItems?.some(
    (item) => item?.product._id === product._id
  );

  const handleCardClick = () => {
    router.push(`/product/${product.uniq_id}`);
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

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-gradient-to-br from-black via-[#0f0e09] to-[#1a180f] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 h-full overflow-hidden border border-gold-500/20 hover:border-gold-500/40 relative cursor-pointer"
    >
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={
            product.image?.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
            "/lamp.jpg"
          }
          alt={product.product_name || "Premium Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 saturate-90 group-hover:saturate-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {showBadge && (
          <div className="absolute top-4 left-4 bg-gradient-to-br from-gray-400 to-white text-black px-3 py-1 rounded-md font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            {badgeText}
          </div>
        )}

        <button
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors 
            bg-black/30 hover:bg-gold-500/20 
            ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleHeart}
          disabled={isUpdating}
        >
          <FaHeart
            className={`w-5 h-5 transition-colors 
              text-white hover:text-gray-400 
              ${isUpdating ? "animate-pulse" : ""}`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        <h4 className="text-lg font-semibold text-gray-100 truncate font-serif tracking-tight">
          {product.product_name}
        </h4>

        <div className="flex items-baseline gap-3">
          <span className="text-xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-mono">
            ₹{product.discounted_price || "8999"}
          </span>
          <span className="text-sm text-gray-400 line-through font-medium">
            ₹{+product.discounted_price + 200 || "9999"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex text-gold-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating?.reviews || 0)
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
              ({product.rating?.reviews || 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
