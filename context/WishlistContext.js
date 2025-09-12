"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useAuth } from "@/hooks/useAuth";

const fetcher = async (url, token) => {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch wishlist data.");
    return res.json();
  } catch (error) {
    console.error("Error fetching wishlist data:", error);
  }
};

const WishlistContext = createContext();
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id;

  const swrKey =
    userId && user?.accessToken
      ? [`${BACKEND_URI}/api/wishlist/${userId}`, user?.accessToken]
      : null;
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    ([url, token]) => fetcher(url, token),
    {
      keepPreviousData: true,
    }
  );

  const wishlistItems = data?.items || [];

  const filteredWishlistItems = wishlistItems.filter(
    (item) => item && item.product
  );

  const performOptimisticUpdate = useCallback(
    async (action, payload) => {
      if (!userId) return toast.error("Please log in to manage your wishlist.");

      let optimisticData;
      if (action === "add") {
        const newItem = { product: payload };
        optimisticData = {
          ...data,
          items: [...filteredWishlistItems, newItem],
        };
      } else {
        optimisticData = {
          ...data,
          items: filteredWishlistItems.filter(
            (item) => item.product._id !== payload
          ),
        };
      }

      await mutate(optimisticData, { revalidate: false });

      try {
        const res = await fetch(`${BACKEND_URI}/api/wishlist/${userId}`, {
          method: action === "add" ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify({
            productId: action === "add" ? payload._id : payload,
          }),
        });
        if (!res.ok) throw new Error(`Failed to ${action} item.`);
        toast.success(`Item ${action === "add" ? "added" : "removed"}!`);
        await mutate();
      } catch (err) {
        toast.error(err.message);
        await mutate();
      }
    },
    [data, userId, mutate, wishlistItems]
  );

  const addToWishlist = useCallback(
    (product) => performOptimisticUpdate("add", product),
    [performOptimisticUpdate]
  );
  const removeItem = useCallback(
    (productId) => performOptimisticUpdate("remove", productId),
    [performOptimisticUpdate]
  );

  const isItemInWishlist = useMemo(() => {
    const itemIds = new Set(
      filteredWishlistItems
        .filter((item) => item && item.product)
        .map((item) => item.product._id)
    );
    return (productId) => itemIds.has(productId);
  }, [wishlistItems]);

  const value = useMemo(
    () => ({
      wishlistItems,
      isLoading: isLoading && !data,
      error,
      addToWishlist,
      removeItem,
      isItemInWishlist,
    }),
    [
      wishlistItems,
      isLoading,
      data,
      error,
      addToWishlist,
      removeItem,
      isItemInWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
