"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useSimilarProducts(productId) {
  const swrKey = productId
    ? `${BACKEND_URI}/api/optimized-products/${productId}/similar`
    : null;
  const { data, error, isLoading } = useSWR(swrKey, fetcher);
  return { similarProducts: data || [], isLoading, error };
}
