"use client";
import useSWR from "swr";
import { useAuth } from "./useAuth";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = (url, token) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

export function useUserOrders(filters, page = 1) {
  const { user } = useAuth();

  const swrKey =
    user?._id && user?.accessToken
      ? [`${BACKEND_URI}/api/orders/${user?._id}`, user?.accessToken]
      : null;

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    ([url, token]) => fetcher(url, token),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    orders: data?.orders || [],
    isLoading,
    error,
    mutate,
  };
}
