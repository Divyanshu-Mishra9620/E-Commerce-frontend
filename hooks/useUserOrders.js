"use client";
import useSWR from "swr";
import { useAuth } from "./useAuth";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useUserOrders(filters, page = 1) {
  const { user, isLoading: authLoading } = useAuth();
  if (authLoading) return null;

  const swrKey = user?._id ? `${BACKEND_URI}/api/orders/${user?._id}` : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    keepPreviousData: true,
  });

  return {
    orders: data?.orders || [],
    isLoading,
    error,
    mutate,
  };
}
