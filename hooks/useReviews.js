"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useReviews(productId) {
  const swrKey = productId
    ? `${BACKEND_URI}/api/reviews/${productId}/reviews`
    : null;

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher);

  return {
    reviews: data?.reviews || [],
    avgRating: data?.avgRating || 0,
    isLoading,
    error,
    mutate,
  };
}
