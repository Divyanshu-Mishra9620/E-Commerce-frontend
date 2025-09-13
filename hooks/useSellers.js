"use client";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { useAuth } from "./useAuth";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = async (url, token) => {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "An error occurred.");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching sellers:", error);
  }
};

export function useSellers(page, searchTerm, sortBy) {
  const { user } = useAuth();

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const params = new URLSearchParams({
    page,
    limit: 10,
    search: debouncedSearch,
    sort: sortBy,
  }).toString();

  const swrKey =
    user?._id && user?.accessToken
      ? [`${BACKEND_URI}/api/sellers?${params}`, user?.accessToken]
      : null;

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    ([url, token]) => fetcher(url, token),
    {
      keepPreviousData: true,
    }
  );

  return {
    sellers: data?.sellers || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    mutate,
  };
}
