"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { authedFetch } from "@/utils/authedFetch";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = async (url) => {
  const res = await authedFetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch cart data.");
  }
  return res.json();
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?._id;
  const swrKey = userId ? `${BACKEND_URI}/api/cart/${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
  });

  const cartItems = data?.items || [];

  const performCartUpdate = useCallback(
    async (action, payload) => {
      if (!userId) return toast.error("Please log in to manage your cart.");

      let url = `/api/cart/${userId}`;
      let options = {};

      switch (action) {
        case "ADD":
        case "UPDATE":
          options = {
            method: "PUT",
            body: {
              productId: payload.product._id,
              quantity: payload.quantity,
            },
          };
          break;
        case "REMOVE":
          url = `/api/cart/${userId}/items/${payload.productId}`;
          options = { method: "DELETE" };
          break;
        case "CLEAR":
          options = { method: "DELETE" };
          break;
        default:
          return;
      }

      try {
        const res = await authedFetch(url, options);
        if (!res.ok) throw new Error((await res.json()).message);

        mutate();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [userId, mutate]
  );

  const { cartCount, cartTotal } = useMemo(() => {
    if (!cartItems) return { cartCount: 0, cartTotal: 0 };
    const count = cartItems.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    const total = cartItems.reduce(
      (acc, item) =>
        acc + (item.quantity || 0) * (item.product?.discounted_price || 0),
      0
    );
    return { cartCount: count, cartTotal: total };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      isLoading: isAuthLoading || isLoading,
      error,
      cartCount,
      cartTotal,
      addToCart: (product, quantity = 1) =>
        performCartUpdate("ADD", { product, quantity }),
      removeItem: (productId) => performCartUpdate("REMOVE", { productId }),
      updateQuantity: (productId, quantity) =>
        performCartUpdate("UPDATE", { productId, quantity }),
      clearCart: () => performCartUpdate("CLEAR"),
      mutateCart: mutate,
    }),
    [
      cartItems,
      isAuthLoading,
      isLoading,
      error,
      cartCount,
      cartTotal,
      performCartUpdate,
      mutate,
    ]
  );

  if (isAuthLoading) return null;

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
