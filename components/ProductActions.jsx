"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import PageLoader from "./PageLoader";

export function ProductActions({ product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isItemInWishlist, addToWishlist, removeItem } = useWishlist();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const cartItem = useMemo(
    () => cartItems.find((item) => item.product._id === product._id),
    [cartItems, product._id]
  );
  const quantityInCart = cartItem?.quantity || 0;
  const inWishlist = isItemInWishlist(product._id);

  const handleCartClick = () => {
    if (!isAuthenticated) return toast.error("Please log in first.");
    if (quantityInCart > 0) {
      updateQuantity(product._id, quantityInCart + 1);
      toast.success("Cart updated!");
    } else {
      addToCart(product, 1);
      toast.success("Added to cart!");
    }
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) return toast.error("Please log in first.");
    if (inWishlist) {
      removeItem(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <PageLoader />
      </div>
    );

  return (
    <div className="flex gap-4 mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCartClick}
        className="flex-1 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        {quantityInCart > 0 ? "Add One More" : "Add to Cart"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWishlistClick}
        className={`p-4 rounded-lg transition-colors ${
          inWishlist
            ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
            : " hover:bg-gray-200"
        }`}
      >
        <Heart
          className={`w-6 h-6 ${inWishlist ? "text-red-500" : "text-gray-400"}`}
        />
      </motion.button>
    </div>
  );
}
