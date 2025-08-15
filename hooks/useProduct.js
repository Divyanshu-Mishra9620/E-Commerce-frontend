"use client";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const useProduct = (slug) => {
  const swrKey = slug ? `${BACKEND_URI}/api/products/${slug}` : null;

  const { data, error, isLoading } = useSWR(swrKey, fetcher);

  return {
    product: data,
    isLoading,
    error,
  };
};
