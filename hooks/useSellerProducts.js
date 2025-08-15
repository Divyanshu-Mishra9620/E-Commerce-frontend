"use client";

import useSWR from "swr";
import { useAuth } from "./useAuth";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const useSellerProducts = () => {
  const { user } = useAuth();

  const userId = user?._id;

  const swrKey = userId ? `${BACKEND_URI}/api/products/sellers` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher);

  return {
    products: data || [],
    isLoading,
    error,
    mutate,
  };
};
