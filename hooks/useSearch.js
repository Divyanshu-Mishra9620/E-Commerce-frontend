"use client";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useSearch(query, filters, sortOrder) {
  const [debouncedQuery] = useDebounce(query, 500);

  const params = new URLSearchParams({
    searchTerm: debouncedQuery,
    sort: sortOrder,
    minPrice: filters.minPrice || 0,
    maxPrice: filters.maxPrice || 100000,
  }).toString();

  const swrKey = debouncedQuery
    ? `${BACKEND_URI}/api/products/search?${params}`
    : null;

  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    keepPreviousData: true,
  });

  return {
    products: data || [],
    isLoading,
    error,
  };
}
