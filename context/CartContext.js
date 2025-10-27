"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { authedFetch } from "@/utils/authedFetch";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = async (url) => {
  const data = await authedFetch(url);
  return data;
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?._id;
  const swrKey = userId ? `/api/cart/${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
  });

  const cartItems = data?.cart?.items || data?.items || [];

  const performCartUpdate = useCallback(
    async (action, payload) => {
      if (!userId) return toast.error("Please log in to manage your cart.");

      let url = `/api/cart/${userId}`;
      let options = {};

      switch (action) {
        case "ADD":
          options = {
            method: "PUT",
            body: {
              productId: payload.product._id,
              quantity: payload.quantity,
            },
          };
          break;
        case "UPDATE":
          options = {
            method: "PUT",
            body: {
              productId: payload.productId,
              quantity: payload.quantity,
            },
          };
          break;
        case "REMOVE":
          options = {
            method: "DELETE",
            body: {
              productId: payload.productId,
            },
          };
          break;
        case "CLEAR":
          options = {
            method: "DELETE",
            body: {},
          };
          break;
        default:
          return;
      }

      try {
        const currentData = data;
        let updatedItems = [
          ...(currentData?.cart?.items || currentData?.items || []),
        ];

        if (action === "ADD") {
          const existingItemIndex = updatedItems.findIndex(
            (item) => item.product?._id === payload.product._id
          );
          if (existingItemIndex > -1) {
            updatedItems[existingItemIndex].quantity += payload.quantity;
          } else {
            updatedItems.push({
              product: payload.product,
              quantity: payload.quantity,
            });
          }
        } else if (action === "UPDATE") {
          const itemIndex = updatedItems.findIndex(
            (item) => item.product?._id === payload.productId
          );
          if (itemIndex > -1) {
            updatedItems[itemIndex].quantity = payload.quantity;
          }
        } else if (action === "REMOVE") {
          updatedItems = updatedItems.filter(
            (item) => item.product?._id !== payload.productId
          );
        } else if (action === "CLEAR") {
          updatedItems = [];
        }

        mutate(
          {
            cart: { items: updatedItems },
            items: updatedItems,
          },
          false
        );

        const res = await authedFetch(url, options);
        if (!res.ok) throw new Error((await res.json()).message);

        mutate();
      } catch (err) {
        toast.error(err.message);
        mutate();
      }
    },
    [userId, mutate, data]
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
