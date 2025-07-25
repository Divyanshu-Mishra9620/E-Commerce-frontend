"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        userRef.current = JSON.parse(stored);
      }
    } else return null;
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = userRef.current?._id;
        if (!userId) throw new Error("User not found");

        const res = await fetch(`${BACKEND_URI}/api/wishlist/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        setWishlistItems(data.items || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    const tempItem = { _id: `temp-${Date.now()}`, product };
    setWishlistItems((prev) => [...prev, tempItem]);

    try {
      const userId = userRef.current?._id;
      if (!userId) throw new Error("User not found");

      const res = await fetch(`${BACKEND_URI}/api/wishlist/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) throw new Error("Failed to add to wishlist");

      const { wishlist } = await res.json();
      setWishlistItems(wishlist.items);
      localStorage.setItem("wishlist", JSON.stringify(wishlist.items));
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Add to wishlist failed");
      setWishlistItems((prev) =>
        prev.filter((item) => item._id !== tempItem._id)
      );
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    const original = wishlistItems;
    setWishlistItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );

    try {
      const userId = userRef.current?._id;
      if (!userId) throw new Error("User not found");

      const res = await fetch(`${BACKEND_URI}/api/wishlist/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId }),
      });

      if (!res.ok) throw new Error("Failed to remove from wishlist");

      const { wishlist } = await res.json();
      setWishlistItems(wishlist.items);
      localStorage.setItem("wishlist", JSON.stringify(wishlist.items));
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Remove from wishlist failed");
      setWishlistItems(original);
      setError(err.message);
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
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
