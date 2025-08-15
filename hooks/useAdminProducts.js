"use client";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useAdminProducts(page, searchTerm) {
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const params = new URLSearchParams({
    page,
    limit: 10,
    search: debouncedSearch,
  }).toString();

  const swrKey = `${BACKEND_URI}/api/products?${params}`;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    keepPreviousData: true,
  });

  return {
    products: data?.products || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    mutate,
  };
}
