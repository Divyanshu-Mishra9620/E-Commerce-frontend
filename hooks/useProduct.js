"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useProduct(slug) {
  const swrKey = slug
    ? `${BACKEND_URI}/api/optimized-products/details/${slug}`
    : null;
  const { data, error, isLoading } = useSWR(swrKey, fetcher);
  return { product: data, isLoading, error };
}
