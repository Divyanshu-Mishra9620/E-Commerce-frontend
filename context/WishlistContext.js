"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const response = await fetch(
        `${BACKEND_URI}/api/wishlist/${savedUser._id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistItems(data.items || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const tempId = `temp-${Date.now()}`;
      setWishlistItems((prev) => [
        ...prev,
        {
          _id: tempId,
          product: { ...product, _id: product._id || tempId },
        },
      ]);

      const response = await fetch(
        `${BACKEND_URI}/api/wishlist/${savedUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        }
      );

      if (!response.ok) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.product._id !== product._id)
        );
        throw new Error("Failed to add item to wishlist");
      }

      const updatedWishlist = await response.json();

      setWishlistItems((prev) => {
        const cleanPrev = prev.filter((item) => item._id !== tempId);
        return [...cleanPrev, ...updatedWishlist.wishlist.items];
      });

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist.wishlist.items)
      );
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      setWishlistItems((prev) => prev.filter((item) => item._id !== tempId));
      setError(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const originalItem = wishlistItems.find(
        (item) => item.product._id === productId
      );

      setWishlistItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );

      const savedUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${BACKEND_URI}/api/wishlist/${savedUser._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: productId }),
        }
      );

      if (!response.ok) {
        setWishlistItems((prev) => [...prev, originalItem]);
        throw new Error("Failed to remove item from wishlist");
      }

      const updatedWishlist = await response.json();
      setWishlistItems(updatedWishlist.wishlist.items);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      setError(error.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeItem,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
