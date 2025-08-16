"use client";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
const fetcher = (url) => fetch(url).then((res) => res.json());

const CartContext = createContext();
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const CartProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/api/auth/signin");
    }
  }, [user, isAuthLoading, router]);

  const userId = user?._id;

  const swrKey = userId ? `${BACKEND_URI}/api/cart/${userId}` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    keepPreviousData: true,
  });

  const cartItems = data?.items || [];

  const performCartUpdate = useCallback(
    async (action, payload) => {
      if (!userId) return toast.error("Please log in to manage your cart.");

      let optimisticData, apiOptions;

      switch (action) {
        case "ADD":
          const newItem = {
            product: payload.product,
            quantity: payload.quantity,
          };
          optimisticData = { ...data, items: [...cartItems, newItem] };
          apiOptions = {
            method: "PUT",
            body: JSON.stringify({
              productId: payload.product._id,
              quantity: payload.quantity,
            }),
          };
          break;
        case "REMOVE":
          optimisticData = {
            ...data,
            items: cartItems.filter(
              (item) => item.product._id !== payload.productId
            ),
          };
          apiOptions = {
            method: "DELETE",
            body: JSON.stringify({ product: payload.productId }),
          };
          break;
        case "UPDATE":
          optimisticData = {
            ...data,
            items: cartItems.map((item) =>
              item.product._id === payload.productId
                ? { ...item, quantity: payload.quantity }
                : item
            ),
          };
          apiOptions = {
            method: "PUT",
            body: JSON.stringify({
              productId: payload.productId,
              quantity: payload.quantity,
            }),
          };
          break;
        case "CLEAR":
          optimisticData = { ...data, items: [] };
          apiOptions = { method: "DELETE" };
          break;
        default:
          return;
      }

      await mutate(optimisticData, { revalidate: false });

      try {
        const res = await fetch(`${BACKEND_URI}/api/cart/${userId}`, {
          ...apiOptions,
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Failed to ${action.toLowerCase()} cart.`);

        await mutate();
      } catch (err) {
        toast.error(err.message);
        await mutate();
      }
    },
    [data, userId, mutate, cartItems]
  );

  const { cartCount, cartTotal } = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const total = cartItems.reduce(
      (acc, item) => acc + item.quantity * (item.product.price || 599),
      0
    );
    return { cartCount: count, cartTotal: total };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      isLoading,
      error,
      cartCount,
      cartTotal,
      addToCart: (product, quantity = 1) =>
        performCartUpdate("ADD", { product, quantity }),
      removeItem: (productId) => performCartUpdate("REMOVE", { productId }),
      updateQuantity: (productId, quantity) =>
        performCartUpdate("UPDATE", { productId, quantity }),
      clearCart: () => performCartUpdate("CLEAR"),
    }),
    [cartItems, isLoading, error, cartCount, cartTotal, performCartUpdate]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
