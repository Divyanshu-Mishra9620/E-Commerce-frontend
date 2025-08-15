"use client";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useSellers(page, searchTerm, sortBy) {
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const params = new URLSearchParams({
    page,
    limit: 10,
    search: debouncedSearch,
    sort: sortBy,
  }).toString();

  const swrKey = `${BACKEND_URI}/api/sellers?${params}`;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    keepPreviousData: true,
  });

  return {
    sellers: data?.sellers || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    mutate,
  };
}
