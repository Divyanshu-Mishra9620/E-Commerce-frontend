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

      const response = await fetch(
        `${BACKEND_URI}/api/wishlist/${savedUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: product._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to wishlist");
      }

      const updatedWishlist = await response.json();
      setWishlistItems(updatedWishlist.items);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      setError(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      console.log(productId);

      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      console.log(savedUser);

      const response = await fetch(
        `${BACKEND_URI}/api/wishlist/${savedUser._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      const updatedWishlist = await response.json();
      console.log(updatedWishlist.wishlist);

      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.product._id !== productId)
      );
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
