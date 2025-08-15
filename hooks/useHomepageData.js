"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useHomepageData() {
  const { data, error, isLoading } = useSWR(
    `${BACKEND_URI}/api/products/homepage-sections`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    }
  );

  return {
    products: data?.products || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
  };
}
